// src/utils/uploadCloudinary.ts

import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

type UploadResult = {
  url: string;
  publicId: string;
};

export const uploadCloudinary = (
  buffer: Buffer,
  folder = "ecommerce/products"
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};