import { Request, Response } from "express";
import pool from "../database";
import { PoolConnection } from "mysql2/promise";

/**
 * Simple function connects to database.
 *
 * Responds with 'Connected'.
 */
const dbStatus = async (req: Request, res: Response) => {
    const conn: PoolConnection = await pool.getConnection();
    res.send("Connected");
    conn.release();
};

export default dbStatus;
