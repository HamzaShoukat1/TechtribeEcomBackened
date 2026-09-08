import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import type { IUser } from "../Types/Models.Types.js";
const userSchema = new Schema<IUser>({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },






    refreshToken: {
        type: String,
    },


    UserProductReview: [
        {
            type: Schema.Types.ObjectId,
            ref: "PRODUCTSCHEMA",
            default: []


        }
    ]



},



    { timestamps: true })

userSchema.pre("save", async function (): Promise<void> {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

export const USERSCHEMA = mongoose.model<IUser>("USERSCHEMA", userSchema) 