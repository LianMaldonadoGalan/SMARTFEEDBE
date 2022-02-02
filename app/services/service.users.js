/* eslint-disable no-undef */
require('dotenv').config();

const pg = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
})

export async function getUser(data) {
    let response
    try {
        response = await pg.select('*').from('users').where({email: data.email, passwd: data.passwd});
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
        response = isAdmin ? await pg.returning(['id_user', 'email', 'created_at']).insert({ email, passwd, isAdmin }).into('users') : await pg.returning(['id_user', 'email', 'created_at']).insert({ email, passwd }).into('users')
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
        response = isAdmin ? await pg("users").returning(['id_user', 'email']).where({ id_user }).update({ email, passwd, isAdmin, updated_at }) : await pg("users").returning(['id_user', 'email']).where({ id_user }).update({ email, passwd, updated_at })
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
        response = await pg("users").where({ id_user }).del()
    }
    catch (error) {
        console.log(error)
        response = { error: 'unable to delete user' }
    }
    return response
}