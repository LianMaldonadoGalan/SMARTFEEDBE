import knex from 'knex';

export default knex({
    client: 'pg',
    connection: { 
        // eslint-disable-next-line no-undef
        connectionString: process.env.NODE_ENV == 'PRODUCTION' ? process.env.PG_CONNECTION_STRING_PROD : process.env.PG_CONNECTION_STRING_DEV,
        ssl: { rejectUnauthorized: false }
    },
    searchPath: ['knex', 'public'],
})