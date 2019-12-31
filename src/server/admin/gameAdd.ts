import { Request, Response } from 'express';
import md5 from 'md5';
import { ACCESS_TAG, BAD_REQUEST_TAG } from '../../constants';
import { Instructor, Password, Section } from '../../types';
import { Game } from '../classes';

/**
 * Add a game from an express route /gameAdd
 */
export const gameAdd = async (req: Request, res: Response) => {
    // Verify Session Exists
    if (!req.session.ir3coursedirector) {
        res.redirect(403, `/index.html?error=${ACCESS_TAG}`);
        return;
    }

    // Verify Request Information Exists
    if (!req.body.adminSection || !req.body.adminInstructor || !req.body.adminPassword) {
        res.redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    const { adminSection, adminInstructor, adminPassword }: GameAddRequest = req.body;

    const adminPasswordHashed = md5(adminPassword);

    // Add the game
    const thisGame = await Game.add(adminSection, adminInstructor, adminPasswordHashed);
    if (!thisGame) {
        res.redirect('/courseDirector.html?gameAdd=failed');
    } else {
        res.redirect('/courseDirector.html?gameAdd=success');
    }
};

/**
 * All the values that should be part of gameAdd request.
 */
type GameAddRequest = {
    adminSection: Section;
    adminInstructor: Instructor;
    adminPassword: Password;
};
