import knexfile from "../knexfile";
import Pino from "pino";
import CustomError from "../ErrorResponse";

const logger = Pino();

const pg = knexfile;

export async function getUserData(data) {
    let response = await pg.select().from("user_data").where(data);

    if (response.error) throw new CustomError(500, "Internal error retrieving ingredients", response.error);
    
    return response.length > 0 ? { message: "user data found", data: response[0] } : { message: "user data not found" };
}

export async function updateUserData(data, queryParams) {
    const updated_at = new Date().toISOString();
    data = { ...data, updated_at };
    
    const columnsReturn = Object.keys(data);
    columnsReturn.push("id_user", "id_user_data")

    let response = await pg("user_data").returning(columnsReturn)
        .where(queryParams)
        .update(data);

    if (response.error) throw new CustomError(500, "Internal error updating user data", response.error);

    return response.length > 0 ? { message: "user data updated", data: response[0] } : { message: "user data not updated" };
}

// TODO: add ability to check if user is able to generate menu
// export async function canGenerateMenu(data) {
//     const userData = await getUserData(data);

//     if(userData.data.id_user_data === null) {
//         return { message: "user data not found", data: null };
//     }

//     const {  } = userData.data;
// }