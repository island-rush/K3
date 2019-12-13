import pool from "../database";
import { Request, Response } from "express";

const dbStatus = async (req: Request, res: Response) => {
    const conn = await pool.getConnection();
    res.send("Connected");
    conn.release();
};

export default dbStatus;
