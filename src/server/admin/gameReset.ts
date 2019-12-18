import { Request, Response } from "express";
import { TeacherSession } from "../../react-client/src/constants/interfaces";
import { Game } from "../classes";
import { ACCESS_TAG } from "../pages/errorTypes";

/**
 * Reset a game from an express route /gameReset
 * @param req Express Request object
 * @param res Express Response object
 */
const gameReset = async (req: Request, res: Response) => {
    //Verify Session
    if (!req.session.ir3teacher) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    const { gameId }: TeacherSession = req.session.ir3teacher;

    const thisGame = await new Game({ gameId }).init(); //If fails, will get caught by router

    await thisGame.reset();

    res.redirect("/teacher.html?gameReset=success");
};

export default gameReset;
