import mongoose, { Schema } from "mongoose";
import type { ICart } from "../Types/Models.Types.js";

const CartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "USERSCHEMA",
            required: [true, "User ID is required"],
            unique: true,
        },

        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "PRODUCTSCHEMA",
                    required: [true, "Product ID is required"],
                },

                productSize: {
                    type: String,
                    required: [true, "Product size is required"],
                },

                productColor: {
                    type: String,
                    required: [true, "Product color is required"],
                },

                quantity: {
                    type: Number,
                    required: [true, "Product quantity is required"],
                    min: [1, "Quantity must be at least 1"],
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const CARTSCHEMA = mongoose.model<ICart>(
    "CARTSCHEMA",
    CartSchema
);