import { Request, Response } from "express";
import { Game } from "../classes";
import { ACCESS_TAG } from "../pages/errorTypes";

/**
 * Delete a game from an express route /gameDelete
 * @param req Express Request Object
 * @param res Express Response Object
 */
const gameDelete = async (req: Request, res: Response) => {
    //Verify Session Exists
    if (!req.session.ir3coursedirector) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    //TODO: delete all sockets assosiated with the game that was deleted?
    //send socket redirect? (if they were still on the game...prevent bad sessions from existing (extra protection from forgetting validation checks))
    if (!req.body.gameId) {
        res.status(400).redirect("/courseDirector.html?gameDelete=failed");
        return;
    }

    const { gameId }: { gameId: number } = req.body;

    //Does the game exist?
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        res.status(400).redirect("/courseDirector.html?gameDelete=failed");
        return;
    }

    await thisGame.delete();

    res.redirect("/courseDirector.html?gameDelete=success");
};

export default gameDelete;
