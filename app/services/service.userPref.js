import knexfile from "../knexfile";
import Pino from "pino";

const logger = Pino();

const pg = knexfile;

export async function getUserPref(data) {
    let response;
    try {
        response = await pg.select().from("user_pref").where(data);
        if(response.length > 0){
            const data = {...response[0]};
            response = { msg: "user pref found" , data };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: "unable to get user pref", error: error };
    }
    return response;
}

export async function updateUserPref(data, queryParams) {
    const updated_at = new Date().toISOString();
    data = { ...data, updated_at };

    let response;
    try {
        response = await pg("user_pref").returning(["id_user_pref", "id_user", "menu_json", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "created_at", "updated_at"])
            .where(queryParams)
            .update(data);

        if(response.length > 0){
            const data = {...response[0]};
            response = { msg: "user pref updated" , data };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: "unable to update user pref", error: error };
    }
    return response;
}