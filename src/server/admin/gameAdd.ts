import { Request, Response } from "express";
import md5 from "md5";
import { Game } from "../classes";
import { ACCESS_TAG, BAD_REQUEST_TAG } from "../pages/errorTypes";

const gameAdd = async (req: Request, res: Response) => {
    if (!req.session.ir3 || !req.session.ir3.courseDirector) {
        res.redirect(403, `/index.html?error=${ACCESS_TAG}`); //TODO: this is different from gameDelete.js status.redirect....
        return;
    }

    const { adminSection, adminInstructor, adminPassword } = req.body;
    if (!adminSection || !adminInstructor || !adminPassword) {
        //TODO: better errors on CD (could have same as index) (status?)
        res.redirect(`/index.html?error=${BAD_REQUEST_TAG}`);
        return;
    }

    const adminPasswordHashed = md5(adminPassword);
    //TODO: validate inputs are within limits of database (x# characters for section....etc)
    const thisGame = await Game.add(adminSection, adminInstructor, adminPasswordHashed);
    if (!thisGame) {
        res.redirect("/courseDirector.html?gameAdd=failed"); //TODO: add status for failure?
    } else {
        res.redirect("/courseDirector.html?gameAdd=success");
    }
};

export default gameAdd;
