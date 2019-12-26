import { Request, Response } from 'express';
import md5 from 'md5';
import { Password } from '../../types';
import { Game } from '../classes';
import { ACCESS_TAG, BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST } from '../pages/errorTypes';

/**
 * Change the admin password for a particular game.
 */
export const setAdminPassword = async (req: Request, res: Response) => {
    // Verify Session
    if (!req.session.ir3coursedirector) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    // Verify Request
    if (!req.body.gameId || !req.body.adminPassword) {
        res.status(403).redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    const { gameId, adminPassword }: SetAdminPassRequest = req.body;

    // Get game info
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        res.status(400).redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    const adminPasswordHashed = md5(adminPassword);
    await thisGame.setAdminPassword(adminPasswordHashed);

    res.redirect('/courseDirector.html?setAdminPassword=success');
};

/**
 * All the values that should be part of a setAdminPassword attempt.
 */
type SetAdminPassRequest = {
    gameId: number;
    adminPassword: Password;
};

export default setAdminPassword;
