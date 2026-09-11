import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId,
             ref: "PRODUCTSCHEMA", required: true },
        name: { type: String, required: true },
        unitPrice: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String },
        color: { type: String },
    },
    { _id: false }
);

const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "USERSCHEMA", required: true, index: true },
        cartId: { type: Schema.Types.ObjectId, ref: "CARTSCHEMA", required: true },
        stripeSessionId: { type: String, unique: true, sparse: true, index: true },
        stripePaymentIntentId: { type: String, index: true },
        items: { type: [orderItemSchema], required: true, minlength: 1 },
        subtotal: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true, default: "USD" },
        status: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "CANCELLED"],
            default: "PENDING",
            index: true,
        },
        customer: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, lowercase: true, trim: true },
            phone: { type: String, required: true },
        },
        shippingAddress: {
            country: { type: String, required: true },
            streetAddress: { type: String, required: true },
            city: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
    },
    { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

export const ORDERSCHEMA = model("ORDER", orderSchema);