import { Request, Response } from "express";
import md5 from "md5";
import { Game } from "../classes";
import { TeacherSession } from "../interfaces";
import { BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST, LOGIN_TAG } from "../pages/errorTypes";

/**
 * Verify credentials and redirect to /teacher or /courseDirector.
 * @param req Express Request Object
 * @param res Express Response Object
 */
const adminLogin = async (req: Request, res: Response) => {
    //Verify Request Information
    const { adminSection, adminInstructor, adminPassword } = req.body;
    if (!adminSection || !adminInstructor || !adminPassword) {
        res.redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    const inputPasswordHash = md5(adminPassword);

    //Do credentials match Course Director?
    const CourseDirectorSection = process.env.CD_SECTION;
    const CourseDirectorLastName = process.env.CD_LASTNAME;
    const CourseDirectorPasswordHash = process.env.CD_PASSWORDHASH;
    if (adminSection == CourseDirectorSection && adminInstructor == CourseDirectorLastName && inputPasswordHash == CourseDirectorPasswordHash) {
        req.session.ir3coursedirector = { courseDirector: true };
        res.redirect("/courseDirector.html");
        return;
    }

    //Get game info
    const thisGame = await new Game({ gameSection: adminSection, gameInstructor: adminInstructor }).init();
    if (!thisGame) {
        res.redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    //Do credentials match game?
    const { gameAdminPassword, gameId } = thisGame;
    if (gameAdminPassword != inputPasswordHash) {
        res.redirect(`/index.html?error=${LOGIN_TAG}`);
        return;
    }

    //Create session
    const session: TeacherSession = { gameId, gameSection: adminSection, gameInstructor: adminInstructor };
    req.session.ir3teacher = session;

    res.redirect(`/teacher.html`);
};

export default adminLogin;
