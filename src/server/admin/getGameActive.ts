import { Request, Response } from "express";
import { Game } from "../classes";

const getGameActive = async (req: Request, res: Response) => {
    if (!req.session.ir3 || !req.session.ir3.teacher || !req.session.ir3.gameId) {
        res.sendStatus(403);
        return;
    }

    const { gameId } = req.session.ir3;

    const thisGame = await new Game({ gameId }).init();

    const { gameActive } = thisGame;

    res.send(JSON.stringify(gameActive));
};

export default getGameActive;
