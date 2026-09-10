import { Apierror } from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import stripe from "../utils/stripe.service.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { CARTSCHEMA } from "../models/Cart.Model.js";
import type { Request, Response } from 'express';
import Stripe from 'stripe';

import { PAYMENTSCHEMA } from "../models/Payment.Model.js";

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

    const line_items = cart.items.map((item) => {
        const product = item.productId as any
        if (!product) {
            throw new Apierror(404, "One or more products in your cart no longer exist");
        }

        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.productName || product.productName,
                    description: product.productDescription || 'Product from your order',
                    images: product.productImage.url ? [product.productImage.url] : [],
                },
                unit_amount: Math.round(product.productPrice * 100),
            },
            quantity: item.quantity,
        };
    });

    // 5. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: line_items,
        customer_email: Emailaddress,

        metadata: {
            userId: userId.toString(),
            cartId: cart._id.toString(),
            customerName: `${FirstName} ${LastName}`,
            shippingAddress: `${StreetAddress}, ${City}, ${Country} - ${ZIPcode}`,
            phone: Phone,
        },

        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
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

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        await PAYMENTSCHEMA.create({
            // customer_email: session.customer_details?.email || session.customer_email || "",
            amount: (session.amount_total ?? 0) / 100,
            // paymentId: session.id,
            // paymentStatus: session.payment_status,
            // createdAt: new Date(session.created * 1000),
        });
    }
    console.log("sa", event)

    return res.status(200).json({ received: true });
});
export {
    handlePayment,
    webhook
};
