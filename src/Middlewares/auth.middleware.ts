import type { TokenPayLoad } from "../Types/types.js"
import jwt from "jsonwebtoken"
import { Apierror } from "../utils/ApiError.js"
import { USERSCHEMA } from "../models/User.Model.js"
import { asynchandler } from "../utils/AsyncHandler.js"

export const verifyjwt = asynchandler(async (req, _res, next) => {
    //get token
    //verify token
    //extrcat user
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new Apierror(401, "Unauthorized request")
    }

    const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
    ) as TokenPayLoad

    const user = await USERSCHEMA
        .findById(decoded._id)
        .select("-password -refreshToken")

    if (!user) {
        throw new Apierror(401, "Invalid access token")
    }

    req.user = user
    next()
})