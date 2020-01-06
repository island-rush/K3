import { Request, Response } from 'express';
import fs from 'fs';
import { BAD_SESSION } from '../../constants';
import { pool } from '../database';

/**
 * Inserts tables into the database that are needed for all game/admin functionality.
 *
 * This is meant as a one-time function to help developers.
 */
export const insertDatabaseTables = async (req: Request, res: Response) => {
    // Verify Session
    if (!req.session.ir3coursedirector) {
        res.redirect(`/index.html?error=${BAD_SESSION}`);
        return;
    }

    // Get the insert sql script
    const queryString = fs.readFileSync('./src/server/sql/tableInsert.sql').toString();

    // Insert the tables
    await pool.query(queryString);

    res.redirect('/courseDirector.html?initializeDatabase=success');
};
