import { Request, Response } from "express";
import { Game } from "../classes";
import { ACCESS_TAG } from "../pages/errorTypes";

/**
 * Get an array of game data for all of island rush.
 */
const getGames = async (req: Request, res: Response) => {
    //Verify Session
    if (!req.session.ir3coursedirector) {
        res.redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    try {
        const results = await Game.getGames();
        res.send(results);
    } catch (error) {
        // console.error(error);
        console.error("Wasn't able to get games from database. Probably missing tables.");
        //Manually send 1 game that makes it obvious what the error is...TODO: change this into a redirect or custom 500 page (but need CourseDirector page to enter tables....)
        res.status(500).send([
            {
                gameId: 69420,
                gameSection: "CLICK",
                gameInstructor: "INITIALIZE",
                gameActive: 0
            }
        ]);
    }
};

export default getGames;
