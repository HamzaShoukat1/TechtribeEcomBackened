import { USERSCHEMA } from "../models/User.Model.js"
import { generateAccessToken, generateRefreshToken, options } from "../Services/Token.Service.js"
import type { IUser } from "../types/Models.Types.js"
import { Apierror } from "../utils/ApiError.js"
import { Apiresponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/AsyncHandler.js"



const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        //get user
        const user = await USERSCHEMA.findById(userId)
        if (!user) throw new Apierror(404, "User not Found")


        const accessToken = generateAccessToken({
            _id: user._id.toString()
        });
        const refreshToken = generateRefreshToken({
            _id: user._id.toString()
        });
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error: any) {
        throw new Apierror(500, error?.message || "Something went wrong while generating access and refresh tokens");

    }
}










const SignUp = asynchandler(async (req, res) => {
    //get user details from fronted
    //validattion
    //check user already exist
    //create user obj in db
    //remove password and refreshToken from res
    //return res
    const { email, FirstName, LastName, password } = req.body

    if ([
        FirstName, email, LastName, password
    ].some((field) => field?.trim() === "")) {
        throw new Apierror(400, "all fields are required")

    }
    if (password.length < 8 || password.length > 100 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
        throw new Apierror(400, "Password must be 8-100 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    }

    const existedUser = await USERSCHEMA.findOne({
        $or: [{ email: email.toLowerCase() }]
    });

    if (existedUser) {
        throw new Apierror(400, "user with this email  already exist")
    }

    const userData: Partial<IUser> = {
        FirstName: FirstName,
        LastName: LastName,
        email: email.toLowerCase(),
        password: password,
    }

    const user = await USERSCHEMA.create(userData)
    const createUser = await USERSCHEMA.findById(user._id).select("-password -refreshToken")
    if (!createUser) {
        throw new Apierror(500, "Something wrong while register User")
    };

    return res.status(201).json(
        new Apiresponse(201, createUser, "User registered SuccessFully")
    )

})


const Signin = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Apierror(400, "Email or password is required");
    }

    const user = await USERSCHEMA.findOne({
        email: email.toLowerCase(),
    });

    if (!user) {
        throw new Apierror(400, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new Apierror(401, "Invalid password");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(user._id.toString());

    const loggedInUser = await USERSCHEMA
        .findById(user._id)
        .select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                {
                    user: loggedInUser,
                    accessToken:accessToken,
                    refreshToken:refreshToken
                },
                "User logged in successfully"
            )
        );
});


const Logout = asynchandler(async (req, res) => {
    await USERSCHEMA.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            returnDocument: "after"
        }
    )
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new Apiresponse(200, {}, "user logged out")

        )

});

const getCurrentUser = asynchandler(async (req, res) => {
    return res.status(200).json(
        new Apiresponse(200, req.user, "current User fetched successfully")

    )

});

const getAllUsers = asynchandler(async (req, res) => {
    if (req.user?.role !== "ADMIN") {
        throw new Apierror(403, "Only admin users can fetch all users")
    }

    const users = await USERSCHEMA
        .find({})
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .lean()

    return res.status(200).json(
        new Apiresponse(200, users, "All users fetched successfully")
    )
})

export {
    SignUp,
    Signin,
    Logout,
    getCurrentUser,
    getAllUsers
}