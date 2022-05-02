import CustomError from "./ErrorResponse"

export default function errorResponseJSON(customError, res){
    const isError = customError instanceof CustomError
    return isError ? res.status(customError.error.status).json(customError.error) : res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: customError
    });
}