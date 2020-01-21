import { Request, Response } from 'express';
import { PoolConnection } from 'mysql2/promise';
import { pool } from '../database';

/**
 * Simple function connects to database.
 *
 * Responds with 'Connected'.
 */
export const dbStatus = async (req: Request, res: Response) => {
    const conn: PoolConnection = await pool.getConnection();
    res.send('Connected');
    conn.release();
};
