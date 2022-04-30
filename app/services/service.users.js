/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'

const logger = Pino()

const pg = knexfile
export async function getUser(data) {
    let response
    try {
        response = await pg.select('id_user', 'email', 'is_administrator').from('users').where(data);
        
        if(response.length > 0) {
            response = { msg: 'user found', data: response[0] };
        }
        else{
            response = { msg: 'user not found' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to get user', error };
    }
    return response;
} 

export async function insertUser(data) {
    const menuString = '{"monday":{},"tuesday":{},"wednesday":{},"thursday":{},"friday":{},"saturday":{},"sunday":{}}'
    const { email, passwd, isAdmin } = data;

    const name = getNameFromEmail(email);

    let response
    try {
        response = isAdmin ? await pg.returning(['id_user', 'email', 'created_at', 'is_administrator']).insert({ email, passwd, isAdmin }).into('users') : await pg.returning(['id_user', 'email', 'created_at', 'is_administrator']).insert({ email, passwd }).into('users')

        if(response.length >= 0) {
            const userPref = await pg.returning(['id_user_pref']).insert({ id_user: response[0].id_user, menu_json: menuString }).into('user_pref');
            const userData = await pg.returning(['id_user_data', 'profile_picture', 'name']).insert({ id_user: response[0].id_user, name }).into('user_data');
            
            const data = { ...response[0], ...userPref[0], ...userData[0] }
            response = { msg: 'user created', data }
        }
        else{
            response = { msg: 'user not created' };
        }
    } catch (error) {
        logger.error(error)
        response = { msg: 'unable to insert user', error }
    }
    return response
}

export async function updateUser(data) {
    const { id_user, email, passwd, isAdmin } = data;
    const updated_at = new Date().toISOString();
    let response
    try {
        response = isAdmin ? await pg("users").returning('id_user', 'email', 'is_administrator').where({ id_user }).update({ email, passwd, isAdmin, updated_at }) : await pg("users").returning(['id_user', 'email', 'is_administrator']).where({ id_user }).update({ email, passwd, updated_at })

        if(response.length >= 0) {
            response = { msg: 'user updated', data: response[0] };
        }
        else{
            response = { msg: 'user not updated' };
        }
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
    const userData = await pg.select().from("user_data").where({id_user});

    try {
        await pg("user_pref").where({ id_user_pref: userPref[0].id_user_pref }).del();
        await pg("user_data").where({ id_user_data: userData[0].id_user_data }).del();
        response = await pg("users").returning(['id_user', 'email']).where({ id_user }).del()

        if (response.length >= 0) {
            response = { msg: 'user deleted', data: response[0] };
        }
        else{
            response = { msg: 'user not deleted' };
        }
    }
    catch (error) {
        logger.error(error);
        response = { msg: 'unable to delete user', error }
    }
    return response
}

function getNameFromEmail(email) {
    return email.split('@')[0]
}


export async function getUserByEmail(data) {
    let response
    try {
        response = await pg.select('email').from('users').where(data);
        if(response.length > 0){
            response = { msg: 'user found', data: response[0] };
        }
        else{
            response = { msg: 'user not found' };
        }
    }
    catch (error) {
        logger.error(error);
        response = { msg: 'unable to get user', error };
    }
    return response;
}