/* eslint-disable no-undef */
import knexfile from "../knexfile";

const pg = knexfile
export async function getUser(data) {
    let response
    try {
        response = await pg.select('id_user', 'email', 'is_administrator').from('users').where({email: data.email, passwd: data.passwd});
    } catch (error) {
        console.log(error);
        response = { error: 'unable to get user' };
    }
    return response;
} 

export async function insertUser(data) {
    const { email, passwd, isAdmin } = data;
    let response
    try {
        response = isAdmin ? await pg.returning(['id_user', 'email', 'created_at', 'is_administrator']).insert({ email, passwd, isAdmin }).into('users') : await pg.returning(['id_user', 'email', 'created_at', 'is_administrator']).insert({ email, passwd }).into('users')
    } catch (error) {
        console.log(error)
        response = { error: 'unable to insert user' }
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
        console.log(error)
        response = { error: 'unable to update user' }
    }
    return response
}

export async function deleteUser(data) {
    const { id_user } = data;
    let response
    try {
        response = await pg("users").returning(['id_user', 'email']).where({ id_user }).del()
    }
    catch (error) {
        console.log(error)
        response = { error: 'unable to delete user' }
    }
    return response
}

export async function terminateConnection() {
    await pg.destroy();
}