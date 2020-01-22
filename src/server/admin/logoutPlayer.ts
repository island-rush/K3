import { Request, Response } from 'express';
import { ACCESS_TAG, GAME_DOES_NOT_EXIST, LOGIN_TAG, NOT_LOGGED_IN_VALUE, SOCKET_SERVER_REDIRECT } from '../../constants';
import { io } from '../../server';
import { TeacherSession } from '../../types';
import { Game } from '../classes';

/**
 * Logout a single player from a game.
 */
export const logoutPlayer = async (req: Request, res: Response) => {
    // Verify Session
    if (!req.session.ir3teacher) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    // Verify Request
    if (!req.body.gameTeam || !req.body.gameController) {
        res.status(403).redirect('/teacher.html?logoutPlayer=failed');
        return;
    }

    const { gameId } = req.session.ir3teacher as TeacherSession;

    // Get game info
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        res.status(400).redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    const { gameTeam, gameController }: LogoutPlayerRequest = req.body;

    await thisGame.setLoggedIn(parseInt(gameTeam), parseInt(gameController), NOT_LOGGED_IN_VALUE);

    io.sockets.to(`game${gameId}team${gameTeam}controller${gameController}`).emit(SOCKET_SERVER_REDIRECT, LOGIN_TAG);

    res.redirect('/teacher.html?logoutPlayer=success');
};

/**
 * All the values needed for request to set team passwords.
 */
type LogoutPlayerRequest = {
    gameTeam: string;
    gameController: string;
};
