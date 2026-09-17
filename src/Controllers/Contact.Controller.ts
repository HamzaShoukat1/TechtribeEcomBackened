import { asynchandler } from "../utils/AsyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { CONTACTSCHEMA } from "../models/Contact.Model.js";
const createContact = asynchandler(async (req, res) => {

    const { name, email, subject, message } = req.body


    const newContact = await CONTACTSCHEMA.create({
        name, email, subject, message
    })

    if (!newContact) {
        throw new Apierror(401, "please provide all details")
    }
    return res.status(200).json(
        new Apiresponse(200, newContact, "contact create successFully")
    )



})

export {
    createContact
}