import { ORDERSCHEMA } from "../models/Order.Model.js";
import { PRODUCTSCHEMA } from "../models/Product.Model.js";
import { USERSCHEMA } from "../models/User.Model.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";

const getDashboardStats = asynchandler(async (req, res) => {
    const [
        totalCustomers,
        totalProducts,
        totalOrders,
        revenueResult,
    ] = await Promise.all([
        USERSCHEMA.countDocuments(),

        PRODUCTSCHEMA.countDocuments(),

        ORDERSCHEMA.countDocuments(),

        ORDERSCHEMA.aggregate([
            {
                $match: {
                    status: {
                        $in: ["DELIVERED"]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$subtotal",
                    },
                },
            },
        ]),
    ]);

    const totalRevenue =
        revenueResult[0]?.totalRevenue ?? 0;

    return res.status(200).json(
        new Apiresponse(
            200,
            {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
            },
            "Dashboard stats fetched successfully"
        )
    );
}
);

export {
    getDashboardStats
}