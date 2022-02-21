import knexfile from "../knexfile";
import Pino from "pino";

const logger = Pino();

const pg = knexfile;

export async function getUserData(data) {
    let response;
    try {
        response = await pg.select().from("user_data").where(data);

        if(response.length >= 0) {
            response = { msg: 'user data found', data: response[0] };
        }
    }
    catch (error) {
        logger.error(error);
        response = { msg: "unable to get user data", error };
    }
    return response;
}

export async function updateUserData(data, queryParams) {
    const updated_at = new Date().toISOString();
    data = { ...data, updated_at };
    
    const columnsReturn = Object.keys(data);
    columnsReturn.push("id_user", "id_user_data")

    let response;
    try {
        response = await pg("user_data").returning(columnsReturn)
            .where(queryParams)
            .update(data);

        if(response.length > 0){
            response = { msg: "user data updated" , data: response[0] };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: "unable to update user data", error: error };
    }
    return response;
}