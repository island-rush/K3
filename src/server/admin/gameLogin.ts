import { Request, Response } from 'express';
import md5 from 'md5';
import { ALREADY_IN_TAG, BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, LOGGED_IN_VALUE, LOGIN_TAG } from '../../constants';
import { GameSession } from '../../types';
import { Game } from '../classes';

/**
 * Verify credentials and redirect to /game
 */
export const gameLogin = async (req: Request, res: Response) => {
    // Verify Request
    if (!req.body.gameSection || !req.body.gameInstructor || !req.body.gameTeam || !req.body.gameTeamPassword || !req.body.gameControllers) {
        res.redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    // Force html strings into ints
    req.body.gameTeam = parseInt(req.body.gameTeam);
    req.body.gameControllers = req.body.gameControllers.map((value: string) => parseInt(value));

    const { gameSection, gameInstructor, gameTeam, gameTeamPassword, gameControllers }: GameLoginRequest = req.body;

    // Get game info
    const gameIdFromSearch = await Game.getId(gameSection, gameInstructor);
    if (!gameIdFromSearch) {
        res.redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    const thisGame = await new Game(gameIdFromSearch).init();
    if (!thisGame) {
        res.redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    const { gameActive, gameId } = thisGame;
    if (!gameActive) {
        res.redirect(`/index.html?error=${GAME_INACTIVE_TAG}`);
        return;
    }

    const inputPasswordHash = md5(gameTeamPassword);
    if (inputPasswordHash !== thisGame.getPasswordHash(gameTeam)) {
        res.redirect(`/index.html?error=${LOGIN_TAG}`);
        return;
    }

    // Are any of the controllers already logged in?
    for (const gameController of gameControllers) {
        if (thisGame.getLoggedIn(gameTeam, gameController) !== 0) {
            res.redirect(`/index.html?error=${ALREADY_IN_TAG}`);
            return;
        }
    }

    // Mark each controller type as logged in
    for (const gameController of gameControllers) {
        await thisGame.setLoggedIn(gameTeam, gameController, LOGGED_IN_VALUE);
    }

    // Create Session
    const session: GameSession = { gameId, gameTeam, gameControllers };
    req.session.ir3 = session;

    res.redirect('/game.html');
};

/**
 * All the values that should be a part of a game login attempt.
 */
type GameLoginRequest = {
    gameSection: string;
    gameInstructor: string;
    gameTeam: number;
    gameTeamPassword: string;
    gameControllers: number[];
};
