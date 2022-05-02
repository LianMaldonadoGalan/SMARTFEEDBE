import CustomError from "./ErrorResponse"

export default function errorBuilderJSON(customError){
    const isError = customError instanceof CustomError
    const errorJSON = {
        status: isError? customError.error.status : 500,
        message: isError? customError.error.message : "Internal Server Error",
        error: isError? customError.error : customError
    }

    return errorJSON
}