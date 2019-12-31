import { Request, Response } from 'express';
import { TeacherSession } from '../../types';
import { Game } from '../classes';

/**
 * Toggle a game from active->inactive, or vice versa.
 */
export const toggleGameActive = async (req: Request, res: Response) => {
    // Verify Session
    if (!req.session.ir3teacher) {
        res.sendStatus(403);
        return;
    }

    const { gameId }: TeacherSession = req.session.ir3teacher;

    const thisGame = await new Game({ gameId }).init();

    const { gameActive } = thisGame;

    const newValue = (gameActive + 1) % 2;

    await thisGame.setGameActive(newValue);

    res.sendStatus(200);
};
