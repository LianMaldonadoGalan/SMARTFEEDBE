import knex from 'knex';

export default knex({
    client: 'pg',
    // eslint-disable-next-line no-undef
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
})