import mongoose, { Schema } from "mongoose";


const ReviewsSchema = new Schema<any>(
    {
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PRODUCTSCHEMA',
        }],
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ORDERSCHEMA",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USERSCHEMA',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },



    },
    {
        timestamps: true
    }
);

export const REVIEWSSCHEMA = mongoose.model<any>("REVIEWSSCHEMA", ReviewsSchema) 