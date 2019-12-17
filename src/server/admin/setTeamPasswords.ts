import { Request, Response } from "express";
import md5 from "md5";
import { Game } from "../classes";
import { ACCESS_TAG, BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST } from "../pages/errorTypes";

const setTeamPasswords = async (req: Request, res: Response) => {
    if (!req.session.ir3teacher) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    if (req.body.game0Password == null || req.body.game1Password == null) {
        res.status(403).redirect(`/teacher.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    const { gameId } = req.session.ir3;

    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        res.status(400).redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    const { game0Password, game1Password } = req.body;
    const game0PasswordHashed = md5(game0Password);
    const game1PasswordHashed = md5(game1Password);

    await thisGame.setTeamPasswords(game0PasswordHashed, game1PasswordHashed);

    res.redirect("/teacher.html?setTeamPasswords=success");
};

export default setTeamPasswords;
