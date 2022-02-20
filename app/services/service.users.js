/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'

const logger = Pino()

const pg = knexfile
export async function getUser(data) {
    let response
    try {
        response = await pg.select('id_user', 'email', 'is_administrator').from('users').where({email: data.email, passwd: data.passwd});
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to get user', error };
    }
    return response;
} 

export async function insertUser(data) {
    const menuString = '{"menu":{"monday":[],"tuesday":[],"wednesday":[],"thursday":[],"friday":[],"saturday":[],"sunday":[]}}'
    const { email, passwd, isAdmin } = data;
    let response
    try {
        response = isAdmin ? await pg.returning(['id_user', 'email', 'created_at', 'is_administrator']).insert({ email, passwd, isAdmin }).into('users') : await pg.returning(['id_user', 'email', 'created_at', 'is_administrator']).insert({ email, passwd }).into('users')

        if(response.length >= 0) {
            const userPref = await pg.returning(['id_user_pref']).insert({ id_user: response[0].id_user, menu_json: menuString }).into('user_pref');
            if(userPref.length >= 0){
                const data = { ...response[0], ...userPref[0] }
                response = { msg: 'user created', data }
            }
        }
    } catch (error) {
        logger.error()
        response = { msg: 'unable to insert user', error }
    }
    return response
}

export async function updateUser(data) {
    const { id_user, email, passwd, isAdmin } = data;
    const updated_at = new Date().toISOString();
    let response
    try {
        response = isAdmin ? await pg("users").returning(['id_user', 'email', 'is_administrator']).where({ id_user }).update({ email, passwd, isAdmin, updated_at }) : await pg("users").returning(['id_user', 'email', 'is_administrator']).where({ id_user }).update({ email, passwd, updated_at })
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to update user', error }
    }
    return response
}

export async function deleteUser(data) {
    const { id_user } = data;
    let response
    const userPref = await pg.select().from("user_pref").where({id_user});
    try {
        await pg("user_pref").where({ id_user_pref: userPref[0].id_user_pref }).del();
        response = await pg("users").returning(['id_user', 'email']).where({ id_user }).del()
    }
    catch (error) {
        logger.error(error);
        response = { msg: 'unable to delete user', error }
    }
    return response
}