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
