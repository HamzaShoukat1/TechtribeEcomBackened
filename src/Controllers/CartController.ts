import mongoose from "mongoose";

import { CARTSCHEMA } from "../models/Cart.Model.js";
import { PRODUCTSCHEMA } from "../models/Product.Model.js";

import { Apierror } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";

const AddToCartItem = asynchandler(async (req, res) => {

    const { id } = req.params as { id: string };

    if (!id) {
        throw new Apierror(400, "Product ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Apierror(400, "Invalid product ID");
    }

    if (!req.user?._id) {
        throw new Apierror(401, "Unauthorized");
    }

    const {
        productSize,
        productColor,
        quantity
    } = req.body;
    

    if (!productSize || !productColor || !quantity) {
        throw new Apierror(
            400,
            "Size, color, and quantity are all required"
        );
    }



    const selectedProduct = await PRODUCTSCHEMA.findById(id);

    if (!selectedProduct) {
        throw new Apierror(404, "Product not found");
    }

    let cart = await CARTSCHEMA.findOne({
        userId: req.user._id
    });

    if (!cart) {

        cart = await CARTSCHEMA.create({
            userId: req.user._id,

            items: [
                {
                    productId: new mongoose.Types.ObjectId(id),
                    productSize,
                    productColor,
                    quantity
                }
            ]
        });

    } else {

        cart.items.push({
            productId: new mongoose.Types.ObjectId(id),
            productSize,
            productColor,
            quantity,
        });

        await cart.save();
    }

    return res.status(200).json(
        new Apiresponse(
            200,
            cart,
            "Product added to cart successfully"
        )
    );
});

export { AddToCartItem };