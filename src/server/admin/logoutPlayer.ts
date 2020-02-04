import { Request, Response } from 'express';
import { ACCESS_TAG, GAME_DOES_NOT_EXIST, LOGIN_TAG, NOT_LOGGED_IN_VALUE, SOCKET_SERVER_REDIRECT, RED_TEAM_ID, BLUE_TEAM_ID } from '../../constants';
import { io } from '../../server';
import { TeacherSession, ControllerType } from '../../types';
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

    const parseValue = parseInt(gameTeam);
    // TODO: weird hack here since we don't know that parseInt will return 0 or 1 (getting past typescript here, not ideal, should fix by figuring out parseInt)
    await thisGame.setLoggedIn(
        parseValue === BLUE_TEAM_ID ? BLUE_TEAM_ID : RED_TEAM_ID,
        parseInt(gameController) as ControllerType,
        NOT_LOGGED_IN_VALUE
    );

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
