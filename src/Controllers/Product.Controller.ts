import { PRODUCTSCHEMA } from "../models/Product.Model.js"
import type { IProduct } from "../Types/Models.Types.js"
import { Apierror } from "../utils/ApiError.js"
import { Apiresponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/AsyncHandler.js"




const createProduct = asynchandler(async (req, res) => {



    const { productName, productPrice, productImage, productSizes, productColors, productDescription } = req.body
    if (!productName || !productPrice || !productPrice || !productColors) {
        throw new Apierror(400, "please provide at least a product name,price,and quantity")

    }


    const productData: Partial<IProduct> = {
        productName,
        productPrice,
        productImage,
        productDescription,
        productSizes: productSizes || [],
        productColors: productColors || [],
    }
    if (updateProduct.length === 0) {
        throw new Apierror(400, "At least one field is required to create");
    }

    const Products = await PRODUCTSCHEMA.create(productData)
    if (!Products) {
        throw new Apierror(400, "product cant create due to some server error")

    }

    return res.status(201).json(
        new Apiresponse(201, Products, "Product create Successfully")
    )


})
const updateProduct = asynchandler(async (req, res) => {
    const { id } = req.params



    const { productName, productPrice, productImage, productSizes, productColors, productDescription } = req.body
    if (!productName || !productPrice || !productPrice || !productColors) {
        throw new Apierror(400, "please provide at least a product name,price,and quantity")

    }


    const updatedFields: Partial<IProduct> = {
        productName,
        productPrice,
        productImage,
        productDescription,
        productSizes: productSizes || [],
        productColors: productColors || [],
    }
    if (updateProduct.length === 0) {
        throw new Apierror(400, "At least one field is required to update");
    }

    const Products = await PRODUCTSCHEMA.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true }
    )
    if (!Products) {
        throw new Apierror(400, "product cant update due to some server error")

    }

    return res.status(201).json(
        new Apiresponse(201, Products, "Product update Successfully")
    )


})


const getAllProduct = asynchandler(async (req, res) => {

    const AllProducts = await PRODUCTSCHEMA.find().select("-productSizes -productColors -productReviews -productQuantity -createdAt -updatedAt")



    if (AllProducts.length === 0) {
        return res.status(200).json(
            new Apiresponse(200, [], "no post")
        )
    };


    const totalPost = await PRODUCTSCHEMA.countDocuments()
    return res.status(200).json(
        new Apiresponse(200, { AllProducts, totalPost }, "products fetched SuccessFully")
    )

});

const getSingleProduct = asynchandler(async (req, res) => {
    const { id } = req.params


    const singleProduct = await PRODUCTSCHEMA.findById(id)

    if (!singleProduct) {
        throw new Apierror(404, "Product not found")
    }
    return res.status(201).json(
        new Apiresponse(200, singleProduct, "single Product fetched Successfully")
    )


});


const deleteSingleProduct = asynchandler(async (req, res) => {
    const { id } = req.params


    const deleteProduct = await PRODUCTSCHEMA.findByIdAndDelete(id)

    if (!deleteProduct) {
        throw new Apierror(404, "Product  not found")
    }
    return res.status(201).json(
        new Apiresponse(200, deleteProduct, "Product Delete Successfully")
    )


})



export {
    createProduct,
    getAllProduct,
    getSingleProduct,
    deleteSingleProduct,
    updateProduct
}