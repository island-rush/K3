import { Request, Response } from "express";
import { Game } from "../classes";
import { ACCESS_TAG } from "../pages/errorTypes";

const gameReset = async (req: Request, res: Response) => {
    if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    const { gameId } = req.session.ir3;

    const thisGame = await new Game({ gameId }).init(); //If fails, will get caught by router

    await thisGame.reset();

    res.redirect("/teacher.html?gameReset=success");
};

export default gameReset;
