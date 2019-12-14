import { Request, Response } from "express";
import fs from "fs";
import pool from "../database";
import { BAD_SESSION } from "../pages/errorTypes";

const insertDatabaseTables = async (req: Request, res: Response) => {
    if (!req.session.ir3 || !req.session.ir3.courseDirector) {
        res.redirect(`/index.html?error=${BAD_SESSION}`);
        return;
    }

    const queryString = fs.readFileSync("./server/sql/tableInsert.sql").toString();

    await pool.query(queryString);

    res.redirect("/courseDirector.html?initializeDatabase=success");
};

export default insertDatabaseTables;
