import { ORDERSCHEMA } from "../models/Order.Model.js";
import { Apierror } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";



const getUserOrdersHistory = asynchandler(async (req, res) => {
    const userId = req.user?._id

    if (!userId) {
        throw new Apierror(401, "Unauthorized access");
    }

    const AllOrders = await ORDERSCHEMA
        .find({ userId })
        .populate("items.productId", "productImage")
        .sort({ createdAt: -1 })
        .lean().select('-cartId -shippingAddress -stripeSessionId -updatedAt')

    const ordersWithProductImages = AllOrders.map((order) => ({
        ...order,
        items: order.items.map((item: any) => ({
            ...item,
            productImage:
                item.productImage ?? item.productId?.productImage?.url,
            productId: item.productId?._id ?? item.productId,
        })),
    }))

    return res.status(200).json(
        new Apiresponse(200, ordersWithProductImages, "All Orders fetched successfully")
    )



})


const getAllOrdersForAdmin = asynchandler(async (req, res) => {
    const AllOrders = await ORDERSCHEMA
        .find()
        .populate("items.productId", "productImage")
        .sort({ createdAt: -1 })
        .lean()

    const ordersWithProductImages = AllOrders.map((order) => ({
        ...order,
        items: order.items.map((item: any) => ({
            ...item,
            productImage:
                item.productImage ?? item.productId?.productImage?.url,
            productId: item.productId?._id ?? item.productId
        })),
    }))
    console.log("sa", ordersWithProductImages)
    return res.status(200).json(
        new Apiresponse(200, ordersWithProductImages, "All Orders fetched successfully")
    )
})

const getOrdersForTable = asynchandler(async (req, res) => {
    const orders = await ORDERSCHEMA
        .find()
        .select(
            "_id customer items subtotal currency status createdAt"
        )
        .sort({ createdAt: -1 })
        .lean();

    const ordersForTable = orders.map((order) => ({
        _id: order._id,
        customer: {
            firstName: order.customer?.firstName,
            lastName: order.customer?.lastName,
            email: order.customer?.email,
        },
        itemCount: order.items.length,
        subtotal: order.subtotal,
        currency: order.currency,
        status: order.status,
        createdAt: order.createdAt,
    }));

    return res.status(200).json(
        new Apiresponse(
            200,
            ordersForTable,
            "All Orders fetched successfully"
        )
    );
});


const ALLOWED_TRANSITIONS = {
    "PENDING": ["SHIPPED"],
    "SHIPPED": ["DELIVERED"],
    "DELIVERED": [] as any
}

const changedOrderStatus = asynchandler(async (req, res) => {
    const orderId = req.params.id

    const { nextStatus } = req.body //shipped or deliverd

    const order = await ORDERSCHEMA.findById(orderId).select("status")
    if (!order) {
        throw new Apierror(404, "order not found")
    };

    const currentStatus = order.status

    const allowedNextStates = ALLOWED_TRANSITIONS[currentStatus]


    if (!allowedNextStates.includes(nextStatus)) {
        throw new Apierror(400, `invalid status transition from ${currentStatus}`)
    }

    order.status = nextStatus
    order.updatedAt = new Date()
    await order.save()


    return res.status(200).json(
        new Apiresponse(200, order, `order status successFully updated to ${nextStatus}`)
    )


















})



export {
    getUserOrdersHistory,
    getOrdersForTable,
    getAllOrdersForAdmin,
    changedOrderStatus
}