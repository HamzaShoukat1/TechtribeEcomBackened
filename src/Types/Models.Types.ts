import { Document, Types } from "mongoose";





export interface IUser extends Document {
    FirstName: string;
    LastName: string;
    email: string;
    password: string;
    refreshToken: string,
    UserProducts: Types.ObjectId
    UserProductReview: Types.ObjectId,
    createdAt: Date;
    updatedAt: Date;

    isPasswordCorrect(password: string): Promise<boolean>

};







export interface IProduct extends Document {
    productName: string;
    productPrice: number;
    productImage: {
        url: string;
    };
    productDescription?: string;
    productReviews?: string[];
    productSizes: ("L" | "XL" | "XS")[]
    productColors?: ("blue" | "black" | "green")[];
    productQuantity: number;
    createdAt: Date;
    updatedAt: Date;
}




export interface ICartItem {
    productId: Types.ObjectId;
    productSize: string;
    productColor: string;
    quantity: number;
}

export interface ICart extends Document {
    userId: Types.ObjectId;
    items: ICartItem[];
}


