import { Request, Response } from 'express';
import md5 from 'md5';
import { ACCESS_TAG, BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST } from '../../constants';
import { TeacherSession } from '../../types';
import { Game } from '../classes';

/**
 * Set each team's password.
 *
 * These passwords are used to log into the game.
 */
export const setTeamPasswords = async (req: Request, res: Response) => {
    // Verify Session
    if (!req.session.ir3teacher) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    // Verify Request
    if (!req.body.gameBluePassword || !req.body.gameRedPassword) {
        res.status(403).redirect(`/teacher.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    const { gameId }: TeacherSession = req.session.ir3teacher;

    // Get game info
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        res.status(400).redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    const { gameBluePassword, gameRedPassword }: SetTeamPassRequest = req.body;
    const gameBluePasswordHashed = md5(gameBluePassword);
    const gameRedPasswordHashed = md5(gameRedPassword);

    await thisGame.setTeamPasswords(gameBluePasswordHashed, gameRedPasswordHashed);

    res.redirect('/teacher.html?setTeamPasswords=success');
};

/**
 * All the values needed for request to set team passwords.
 */
type SetTeamPassRequest = {
    gameBluePassword: string;
    gameRedPassword: string;
};
