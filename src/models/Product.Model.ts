import mongoose, { Schema } from "mongoose";
import type { IProduct } from "../Types/Models.Types.js";

const ProductSchema = new Schema<IProduct>(
    {
        productName: {
            type: String,
        },
        productPrice: {
            type: Number,
        },
        productImage: {
            url: { type: String, },
        },
        productDescription: {
            type: String,
        },
        productReviews: [
            {
                type: String,
            },
        ],
        productSizes: {
            type: [String],
            enum: ["L", "XL", "XS"],
            default: [],
        },
        productColors: {
            type: [String],
            required: [true, "Product Color is required"],
            default: [],
        },
        productQuantity: {
            type: Number,
            required: [true, "Product quantity is required"],
            min: [1, "Quantity cannot be negative"],
            default: 1
        },


    },
    {
        timestamps: true
    }
);

export const PRODUCTSCHEMA = mongoose.model<IProduct>("PRODUCTSCHEMA", ProductSchema) 