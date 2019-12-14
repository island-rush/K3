/**
 * Database configuration, for accessing a mysql database using mysql2
 * Creates a pool of connections to use
 * Exports the pool for use in other files (Classes)
 */

import mysql, { PoolOptions } from "mysql2/promise";
import { Pool } from "mysql2/promise";

const host: string = process.env.DB_HOSTNAME;
const user: string = process.env.DB_USERNAME;
const password: string = process.env.DB_PASSWORD;
const database: string = process.env.DB_NAME;

// Personal Dev Database
// const host: string = "remotemysql.com";
// const user: string = "X0MOPhjMXL";
// const password: string = "1bhg03PyGl";
// const database: string = "X0MOPhjMXL";

const databaseConfig: PoolOptions = {
    connectionLimit: 25,
    host,
    user,
    password,
    database,
    multipleStatements: true //it allows for SQL injection attacks if values are not properly escaped
};

let pool: Pool = mysql.createPool(databaseConfig);

export default pool;
