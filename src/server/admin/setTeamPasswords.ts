import { Request, Response } from "express";
import md5 from "md5";
import { Game } from "../classes";
import { TeacherSession } from "../interfaces";
import { ACCESS_TAG, BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST } from "../pages/errorTypes";

/**
 * All the values needed for request to set team passwords.
 */
interface SetTeamPassRequest {
    game0Password: string;
    game1Password: string;
}

/**
 * Set each team's password.
 * These passwords are used to log into the game.
 * @param req Express Request object
 * @param res Express Response object
 */
const setTeamPasswords = async (req: Request, res: Response) => {
    //Verify Session
    if (!req.session.ir3teacher) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    //Verify Request
    if (!req.body.game0Password || !req.body.game1Password) {
        res.status(403).redirect(`/teacher.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    const { gameId }: TeacherSession = req.session.ir3teacher;

    //Get game info
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        res.status(400).redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    const { game0Password, game1Password }: SetTeamPassRequest = req.body;
    const game0PasswordHashed = md5(game0Password);
    const game1PasswordHashed = md5(game1Password);

    await thisGame.setTeamPasswords(game0PasswordHashed, game1PasswordHashed);

    res.redirect("/teacher.html?setTeamPasswords=success");
};

export default setTeamPasswords;
