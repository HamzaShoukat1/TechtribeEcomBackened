// src/Controllers/Upload.Controller.ts

import type { Request, Response } from "express";

import { asynchandler } from "../utils/AsyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { uploadCloudinary } from "../utils/upload.Cloudinary.js";


const uploadImage = asynchandler(
    async (req: Request, res: Response) => {
        if (!req.file) {
            throw new Apierror(400, "Image file is required");
        }

        const result = await uploadCloudinary(
            req.file.buffer,
            "ecommerce/products"
        );

        return res.status(200).json(
            new Apiresponse(
                200,
                result,
                "Image uploaded successfully"
            )
        );
    }
);

export {
    uploadImage
}