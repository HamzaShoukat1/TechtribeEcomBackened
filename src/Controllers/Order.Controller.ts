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
        .lean() 

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

export {
    getUserOrdersHistory
}