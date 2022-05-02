import knexfile from "../knexfile";
import Pino from "pino";
import CustomError from "../ErrorResponse";

const logger = Pino();

const pg = knexfile;

export async function getUserPref(data) {
    let response = await pg.select().from("user_pref").where(data);

    if (response.error) throw new CustomError(500, "Internal error retrieving user pref", response.error);

    return response.length > 0 ? { message: "user pref found", data: response[0] } : { message: "user pref not found" };
}

export async function updateUserPref(data, queryParams) {
    const updated_at = new Date().toISOString();
    data = { ...data, updated_at };

    let response = await pg("user_pref").returning(["id_user_pref", "id_user", "menu_json", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "created_at", "updated_at"])
        .where(queryParams)
        .update(data);

    if (response.error) throw new CustomError(500, "Internal error updating user pref", response.error);

    return response.length > 0 ? { message: "user pref updated", data: response[0] } : { message: "user pref not found" };
}