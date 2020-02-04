import { Request, Response } from 'express';
import md5 from 'md5';
import { BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST, LOGIN_TAG } from '../../constants';
import { TeacherSession } from '../../types';
import { Game } from '../classes';

/**
 * Verify credentials and redirect to /teacher or /courseDirector.
 */
export const adminLogin = async (req: Request, res: Response) => {
    // Verify Request Information
    if (!req.body.adminSection || !req.body.adminInstructor || !req.body.adminPassword) {
        res.redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    const { adminSection, adminInstructor, adminPassword }: AdminLoginRequest = req.body;

    const inputPasswordHash = md5(adminPassword);

    // Do credentials match Course Director?
    const CourseDirectorSection = process.env.CD_SECTION;
    const CourseDirectorLastName = process.env.CD_LASTNAME;
    const CourseDirectorPasswordHash = process.env.CD_PASSWORDHASH;
    if (
        adminSection.toLowerCase() === CourseDirectorSection.toLowerCase() &&
        adminInstructor.toLowerCase() === CourseDirectorLastName.toLowerCase() &&
        inputPasswordHash === CourseDirectorPasswordHash
    ) {
        req.session.ir3coursedirector = { courseDirector: true };
        res.redirect('/courseDirector.html');
        return;
    }

    // Get game info
    const gameIdFromSearch = await Game.getId(adminSection.toLowerCase(), adminInstructor.toLowerCase());
    if (!gameIdFromSearch) {
        res.redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    const thisGame = await new Game(gameIdFromSearch).init();
    if (!thisGame) {
        res.redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    // Do credentials match game?
    const { gameAdminPassword, gameId } = thisGame;
    if (gameAdminPassword !== inputPasswordHash) {
        res.redirect(`/index.html?error=${LOGIN_TAG}`);
        return;
    }

    // Create session
    const session: TeacherSession = { gameId, gameSection: adminSection.toLowerCase(), gameInstructor: adminInstructor.toLowerCase() };
    req.session.ir3teacher = session;

    res.redirect('/teacher.html');
};

/**
 * All the values that should be part of an admin login attempt.
 */
type AdminLoginRequest = {
    adminSection: string;
    adminInstructor: string;
    adminPassword: string;
};
