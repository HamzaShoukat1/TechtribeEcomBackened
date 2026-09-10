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

    const { productSize, productColor, quantity } = req.body;

    if (!productSize || !productColor || !quantity) {
        throw new Apierror(400, "Size, color, and quantity are all required");
    }

    // 1. Verify product actually exists
    const selectedProduct = await PRODUCTSCHEMA.findById(id);
    if (!selectedProduct) {
        throw new Apierror(404, "Product not found");
    }

    let cart = await CARTSCHEMA.findOne({ userId: req.user._id });

    if (!cart) {
        // Create a new cart if it doesn't exist
        cart = await CARTSCHEMA.create({
            userId: req.user._id,
            items: [
                {
                    productId: new mongoose.Types.ObjectId(id),
                    productSize,
                    productColor,
                    quantity: Number(quantity)
                }
            ]
        });
    } else {
        // cart.items = cart.items.filter(item => item && item.productId);

        const alreadyExist = cart.items.find(item =>
            item?.productId?.toString() === id &&
            item.productSize === productSize &&
            item.productColor === productColor
        );

        if (alreadyExist) {
            cart.items = cart.items.map(item => {
                if (
                    item?.productId?.toString() === id &&
                    item.productSize === productSize &&
                    item.productColor === productColor
                ) {
                    item.quantity = item.quantity + Number(quantity);
                }
                return item;
            });
        } else {
            cart.items.push({
                productId: new mongoose.Types.ObjectId(id),
                productSize,
                productColor,
                quantity: Number(quantity)
            });
        }

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



const getCartDetails = asynchandler(async (req, res) => {
    if (!req.user?._id) {
        throw new Apierror(401, "Unauthorized");
    }

    const cart = await CARTSCHEMA.findOne({
        userId: req.user._id
    }).populate("items.productId");

    if (!cart) {
        throw new Apierror(404, "Cart not found");
    }

    return res.status(200).json(
        new Apiresponse(
            200,
            cart,
            "Cart details fetched successfully"
        )
    );
});

const removeFromCart = asynchandler(async (req, res) => {
    const { id } = req.params as { id: string };

    if (!req.user?._id) {
        throw new Apierror(401, "Unauthorized");
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Apierror(400, "Invalid cart item ID");
    }

    const cart = await CARTSCHEMA.findOneAndUpdate(
        {
            userId: req.user._id,
            "items._id": id,
        },
        {
            $pull: {
                items: { _id: id },
            },
        },
        {
            returnDocument: "after"
        }
    ).populate("items.productId");

    if (!cart) {
        throw new Apierror(404, "Cart item not found");
    }

    return res.status(200).json(
        new Apiresponse(
            200,
            cart,
            "Product removed from cart successfully"
        )
    );
});

export { AddToCartItem, getCartDetails, removeFromCart };