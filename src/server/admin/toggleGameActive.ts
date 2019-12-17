import { Request, Response } from "express";
import { Game } from "../classes";
import { TeacherSession } from "../interfaces";

/**
 * Toggle a game from active->inactive, or vice versa.
 * @param req Express Request object
 * @param res Express Response object
 */
const toggleGameActive = async (req: Request, res: Response) => {
    //Verify Session
    if (!req.session.ir3teacher) {
        res.sendStatus(403); //TODO: redirect here?
        return;
    }

    const { gameId }: TeacherSession = req.session.ir3teacher;

    const thisGame = await new Game({ gameId }).init();

    const { gameActive } = thisGame;

    const newValue = (gameActive + 1) % 2;

    await thisGame.setGameActive(newValue);

    res.sendStatus(200);
};

export default toggleGameActive;
