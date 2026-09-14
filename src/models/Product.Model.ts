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
            type: Map,            // Tells Mongoose this path is a Map
    of: String,           // Specifies that values must be Strings
    default: new Map()
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