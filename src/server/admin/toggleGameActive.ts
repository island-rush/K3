import { Request, Response } from 'express';
import { GAME_INACTIVE_TAG, SOCKET_SERVER_REDIRECT } from '../../constants';
import { io } from '../../server';
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

    const { gameId } = req.session.ir3teacher as TeacherSession;

    const thisGame = await new Game({ gameId }).init();

    const { gameActive } = thisGame;

    const newValue = (gameActive + 1) % 2;

    await thisGame.setGameActive(newValue);

    io.sockets.to(`game${gameId}`).emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);

    res.sendStatus(200);
};
