import path from "path";
import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    // delete req.session.ir3;
    res.sendFile(__dirname + "/pages/index.html");
});

router.get("/index.html", (req: Request, res: Response) => {
    // delete req.session.ir3;
    res.sendFile(__dirname + "/pages/index.html");
});

router.get("/troubleshoot.html", (req: Request, res: Response) => {
    // delete req.session.ir3;
    res.sendFile(__dirname + "/pages/troubleshoot.html");
});

router.get("/credits.html", (req: Request, res: Response) => {
    // delete req.session.ir3;
    res.sendFile(__dirname + "/pages/credits.html");
});

export default router;
