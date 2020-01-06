import mysql, { Pool, PoolOptions } from 'mysql2/promise';

const host = process.env.DB_HOSTNAME;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const databaseConfig: PoolOptions = {
    connectionLimit: 25,
    host,
    user,
    password,
    database,
    multipleStatements: true // it allows for SQL injection attacks if values are not properly escaped
};

/**
 * Pool of database connections.
 */
export const pool: Pool = mysql.createPool(databaseConfig);
