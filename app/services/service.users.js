/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'

const logger = Pino()

const pg = knexfile
export async function getUser(data) {
    let response = await pg.select('id_user', 'email', 'is_administrator').from('users').where(data);
    
    if (response.error) throw new CustomError(500, "Internal error retrieving user", response.error);

    return response.length > 0 ? { message: "user found", data: response[0] } : { message: "user not found" };
} 

export async function insertUser(data) {
    const menuString = '{"monday":{"desayuno":[642],"almuerzo":[615],"comida":[707],"merienda":[625],"cena":[619]},"tuesday":{"desayuno":[642],"almuerzo":[606],"comida":[654],"merienda":[625],"cena":[619]},"wednesday":{"desayuno":[642],"almuerzo":[656],"comida":[660],"merienda":[613],"cena":[619]},"thursday":{"desayuno":[642],"almuerzo":[614],"comida":[707],"merienda":[625],"cena":[646]},"friday":{"desayuno":[642],"almuerzo":[606],"comida":[653],"merienda":[613],"cena":[661]},"saturday":{"desayuno":[642],"almuerzo":[665],"comida":[609],"merienda":[625],"cena":[661]},"sunday":{"desayuno":[642],"almuerzo":[602],"comida":[629],"merienda":[625],"cena":[646]}}'
    const { email, passwd, isAdmin } = data;

    const name = getNameFromEmail(email);

    let response = isAdmin ? await pg.returning(['id_user', 'email', 'created_at', 'is_administrator']).insert({ email, passwd, isAdmin }).into('users') : await pg.returning(['id_user', 'email', 'created_at', 'is_administrator']).insert({ email, passwd }).into('users')

    if (response.error) throw new CustomError(500, "Internal error inserting user", response.error);

    if(response.length >= 0) {
        const userPref = await pg.returning(['id_user_pref']).insert({ id_user: response[0].id_user, menu_json: menuString }).into('user_pref');
        const userData = await pg.returning(['id_user_data', 'profile_picture', 'name']).insert({ id_user: response[0].id_user, name }).into('user_data');
        
        const data = { ...response[0], ...userPref[0], ...userData[0] }
        response = { message: 'user created', data }
    }
    else{
        response = { message: 'user not created' };
    }
    return response
}

export async function updateUser(data) {
    const { id_user, email, passwd, isAdmin } = data;
    const updated_at = new Date().toISOString();

    let response = isAdmin ? await pg("users").returning('id_user', 'email', 'is_administrator').where({ id_user }).update({ email, passwd, isAdmin, updated_at }) : await pg("users").returning(['id_user', 'email', 'is_administrator']).where({ id_user }).update({ email, passwd, updated_at })

    if (response.error) throw new CustomError(500, "Internal error updating user", response.error);

    return response.length > 0 ? { message: "user updated", data: response[0] } : { message: "user not updated" };
}

export async function deleteUser(data) {
    const { id_user } = data;
    let response
    
    const userPref = await pg.select().from("user_pref").where({id_user});
    const userData = await pg.select().from("user_data").where({id_user});
    
    await pg("user_pref").where({ id_user_pref: userPref[0].id_user_pref }).del();
    await pg("user_data").where({ id_user_data: userData[0].id_user_data }).del();
    response = await pg("users").returning(['id_user', 'email']).where({ id_user }).del()

    if (response.error) throw new CustomError(500, "Internal error deleting user", response.error);

    return response.length > 0 ? { message: "user deleted", data: response[0] } : { message: "user not deleted" };
}

function getNameFromEmail(email) {
    return email.split('@')[0]
}


export async function getUserByEmail(data) {
    let response = await pg.select('email').from('users').where(data);

    if (response.error) throw new CustomError(500, "Internal error retrieving user", response.error);

    return response.length > 0 ? { message: "user found", data: response[0] } : { message: "user not found" };
}