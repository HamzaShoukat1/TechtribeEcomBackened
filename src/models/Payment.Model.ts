import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema<any>(
    {
        idempotencyKey: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "USERSCHEMA",
            required: [true, "User ID is required"],
            index: true,
            unique: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ORDER",
            required: true
        },
        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },
        currency: {
            type: String,
            required: true,
            default: "USD"

        },
        status: {
            type: String,
            required: true,
            enum: ['PENDING', 'SUCCESSFUL', 'FAILED',],
            default: 'PENDING'
        },



    },
    {
        timestamps: true,
    }
);
paymentSchema.index({ userId: 1, createdAt: -1 })

export const PAYMENTSCHEMA = mongoose.model<any>("PAYMENTSCHEMA", paymentSchema);