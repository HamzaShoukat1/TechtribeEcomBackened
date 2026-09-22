import { Apierror } from "../utils/ApiError.js"
import { asynchandler } from "../utils/AsyncHandler.js"
import { REVIEWSSCHEMA } from "../models/Review.Model.js"
import { Apiresponse } from "../utils/ApiResponse.js"
import { ORDERSCHEMA } from "../models/Order.Model.js";

const CreateReviews = asynchandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new Apierror(401, "User not authenticated");
    }

    const { orderId, rating, comment } = req.body;
    if (!orderId || !rating ) {
        throw new Apierror(400, "cant added comment due to server issue");
    }

    const alreadyReviewed = await REVIEWSSCHEMA.findOne({ orderId, userId });
    if (alreadyReviewed) {
        throw new Apierror(400, "You have already reviewed this product");
    }

    const order = await ORDERSCHEMA.findById(orderId);
    if (!order) {
        throw new Apierror(404, "Order not found");
    }


    const productsId = order.items.map(item => item.productId);

    const review = await REVIEWSSCHEMA.create({
        userId,
        orderId,
        products: productsId,
        rating,
        comment
    });

    if (!review) {
        throw new Apierror(500, "Review could not be created due to a server issue");
    }

    return res.status(201).json(
        new Apiresponse(201, review, "Review created successfully")
    );
});





const GetProductReviews = asynchandler(async (req, res) => {
    const { productId } = req.params;
    const products = productId

    if (!productId) {
        throw new Apierror(400, "Product ID is required");
    }

    const reviews = await REVIEWSSCHEMA.find({ products }).populate("userId", "FirstName email").sort({ createdAt: -1 })

    if (!reviews) {
        throw new Apierror(401, "no user found for this product")
    }
    return res.status(200).json(
        new Apiresponse(200, reviews, "Reviews fetched successfully for specific user")
    );

   


});


export {
    CreateReviews,
    GetProductReviews
};
