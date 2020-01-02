import { Request, Response } from 'express';
import { TeacherSession } from '../../types';
import { Game } from '../classes';

/**
 * Get the gameActive status of a game.
 */
export const getGameActive = async (req: Request, res: Response) => {
    // Verify Session
    if (!req.session.ir3teacher) {
        res.sendStatus(403);
        return;
    }

    const { gameId } = req.session.ir3teacher as TeacherSession;

    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        res.sendStatus(404);
        return;
    }

    const { gameActive } = thisGame;

    res.send(JSON.stringify(gameActive));
};
