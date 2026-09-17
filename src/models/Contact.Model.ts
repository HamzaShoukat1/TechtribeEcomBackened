import mongoose, { Schema } from "mongoose";


const ContactSchema = new Schema<any>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [/.+\@.+\..+/, 'Please fill a valid email address']
        },
        subject: {
            type: String,
            required: [true, "message is required"]
        },
        message: {
            type: String,
            required: [true, 'Message is required']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

    },
    {
        timestamps: true
    }
);

export const CONTACTSCHEMA = mongoose.model<any>("CONTACTSCHEMA", ContactSchema) 