import { Request, Response } from "express";
import pool from "../database";

const dbStatus = async (req: Request, res: Response) => {
    const conn = await pool.getConnection();
    res.send("Connected");
    conn.release();
};

export default dbStatus;
