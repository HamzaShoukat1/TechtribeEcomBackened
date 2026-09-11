import { Apierror } from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import stripe from "../utils/stripe.service.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { CARTSCHEMA } from "../models/Cart.Model.js";
import type { Request, Response } from 'express';
import Stripe from 'stripe';

import { PAYMENTSCHEMA } from "../models/Payment.Model.js";
import { ORDERSCHEMA } from "../models/Order.Model.js";

const handlePayment = asynchandler(async (req, res) => {
    const { FirstName, LastName, Country, City, StreetAddress, ZIPcode, Phone, Emailaddress } = req.body;
    const userId = req.user?._id

    // 1. Validate authorization
    if (!userId) {
        throw new Apierror(401, "Unauthorized");
    }

    // 2. Validate incoming shipping details
    if (!FirstName || !LastName || !Country || !City || !StreetAddress || !ZIPcode || !Phone || !Emailaddress) {
        throw new Apierror(400, "Please provide all the shipping and contact details");
    }

    // 3. Fetch real cart data 
    const cart = await CARTSCHEMA.findOne({
        userId: userId
    }).populate("items.productId");

    if (!cart || !cart.items || cart.items.length === 0) {
        throw new Apierror(404, "Your cart is empty or could not be found");
    }

    const orderItems = cart.items.map((item: any) => {
        const product = item.productId as any;
        if (!product) {
            throw new Apierror(404, "One or more products in your cart no longer exist");
        }

        return {
            productId: product._id,
            name: product.productName,
            unitPrice: product.productPrice,
            quantity: item.quantity,
            size: item.productSize,
            color: item.productColor,
        };
    });

    const subtotal = orderItems.reduce(
        (total: number, item: { unitPrice: number; quantity: number }) =>
            total + item.unitPrice * item.quantity,
        0
    );

    const order = await ORDERSCHEMA.create({
        userId,
        cartId: cart._id,
        items: orderItems,
        subtotal,
        customer: {
            firstName: FirstName,
            lastName: LastName,
            email: Emailaddress,
            phone: Phone,
        },
        shippingAddress: {
            country: Country,
            streetAddress: StreetAddress,
            city: City,
            zipCode: ZIPcode,
        },
    });

    const line_items = orderItems.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
            },
            unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
    }));

    // Create the Stripe Checkout Session
    let session: Stripe.Checkout.Session;
    try {
        session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: line_items,
            customer_email: Emailaddress,

            metadata: {
                userId: userId.toString(),
                cartId: cart._id.toString(),
                orderId: order._id.toString(),
                customerName: `${FirstName} ${LastName}`,
                shippingAddress: `${StreetAddress}, ${City}, ${Country} - ${ZIPcode}`,
                phone: Phone,
            },

            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
        });
    } catch (error) {
        await ORDERSCHEMA.findByIdAndUpdate(order._id, { status: "FAILED" });
        throw error;
    }

    await ORDERSCHEMA.findByIdAndUpdate(order._id, {
        stripeSessionId: session.id,
    });

    return res.status(200).json(
        new Apiresponse(
            200,
            { url: session.url },
            "Checkout session created successfully"
        )
    );
});


const webhook = asynchandler(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
        throw new Apierror(400, "Missing stripe-signature header or webhook secret");
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        throw new Apierror(400, `Webhook Error: ${err.message}`);
    }

    const handledEvents = new Set([
        "checkout.session.completed",
        "checkout.session.expired",
        "checkout.session.async_payment_failed",
    ]);

    if (!handledEvents.has(event.type)) {
        return res.status(200).json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, cartId, orderId } = session.metadata ?? {};
    const paymentIntentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!userId || !cartId || !orderId || !session.id || session.amount_total === null) {
        throw new Apierror(400, "Stripe session is missing required payment metadata");
    }

    if (event.type === "checkout.session.completed") {
        const paid = session.payment_status === "paid";

        await PAYMENTSCHEMA.findOneAndUpdate(
            { stripeSessionId: session.id },
            {
                $set: {
                    stripeSessionId: session.id,
                    stripePaymentIntentId: paymentIntentId,
                    userId,
                    orderId,
                    amount: (session.amount_total ?? 0) / 100,
                    currency: (session.currency ?? "usd").toUpperCase(),
                    status: paid ? "SUCCESSFUL" : "PENDING",
                    customerEmail: session.customer_details?.email ?? session.customer_email,
                },
                $setOnInsert: { idempotencyKey: event.id },
            },
            { upsert: true, new: true, runValidators: true }
        );

        await ORDERSCHEMA.findByIdAndUpdate(orderId, {
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            status: paid ? "PAID" : "PENDING",
        });

        if (paid) {
            await CARTSCHEMA.findOneAndUpdate(
                { _id: cartId, userId },
                { $set: { items: [] } }
            );
        }
    }

    if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
        await ORDERSCHEMA.findByIdAndUpdate(orderId, { status: "CANCELLED" });
        await PAYMENTSCHEMA.findOneAndUpdate(
            { stripeSessionId: session.id },
            {
                $set: {
                    stripeSessionId: session.id,
                    stripePaymentIntentId: paymentIntentId,
                    userId,
                    orderId,
                    amount: (session.amount_total ?? 0) / 100,
                    currency: (session.currency ?? "usd").toUpperCase(),
                    status: "FAILED",
                    customerEmail: session.customer_details?.email ?? session.customer_email,
                },
                $setOnInsert: { idempotencyKey: event.id },
            },
            { upsert: true, new: true, runValidators: true }
        );
    }

    return res.status(200).json({ received: true });
});

const getPaymentDetails = asynchandler(async (req, res) => {
    const userId = req.user?._id;
    const { session_id } = req.params;

    if (!userId) {
        throw new Apierror(401, "Unauthorized access");
    }

    const order = await PAYMENTSCHEMA.findOne({
        userId: userId,
        stripeSessionId: session_id
    }).select("-currency -idempotencyKey -stripePaymentIntentId -updatedAt -customerEmail -status")

    if (!order) {
        throw new Apierror(404, "Order not found. Please refresh if you just paid.");
    }

    return res.status(200).json(
        new Apiresponse(200, order, "Payment details fetched successfully")
    );
});


export {
    handlePayment,
    webhook,
    getPaymentDetails,
};
