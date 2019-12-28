import { Request, Response, Router } from 'express';
import path from 'path';
import { DATABASE_TAG, LOGIN_TAG } from '../constants';
// prettier-ignore
import { adminLogin, dbStatus, gameAdd, gameDelete, gameLogin, gameReset, getGameActive, getGames, getNews, insertDatabaseTables, setAdminPassword, setTeamPasswords, toggleGameActive, logout } from './admin';

/**
 * Express Router to handle different routes on the server.
 */
export const router: Router = Router();

// --------------------------------------
// Sending Files
// --------------------------------------

router.get('/', (req: Request, res: Response) => {
    // Being on the homepage(s) ensures a user is logged out / no session
    if (req.session.ir3) {
        // log them out
        logout(req.session.ir3);
        delete req.session.ir3;
    }
    delete req.session.ir3; // Game Session
    delete req.session.ir3teacher; // Teacher Session
    delete req.session.ir3coursedirector; // Course Director Session
    res.sendFile(`${__dirname}/pages/index.html`);
});

router.get('/index.html', (req: Request, res: Response) => {
    if (req.session.ir3) {
        // log them out
        logout(req.session.ir3);
        delete req.session.ir3;
    }
    delete req.session.ir3teacher;
    delete req.session.ir3coursedirector;
    res.sendFile(`${__dirname}/pages/index.html`);
});

router.get('/troubleshoot.html', (req: Request, res: Response) => {
    if (req.session.ir3) {
        // log them out
        logout(req.session.ir3);
        delete req.session.ir3;
    }
    delete req.session.ir3teacher;
    delete req.session.ir3coursedirector;
    res.sendFile(`${__dirname}/pages/troubleshoot.html`);
});

router.get('/credits.html', (req: Request, res: Response) => {
    if (req.session.ir3) {
        // log them out
        logout(req.session.ir3);
        delete req.session.ir3;
    }
    delete req.session.ir3teacher;
    delete req.session.ir3coursedirector;
    res.sendFile(`${__dirname}/pages/credits.html`);
});

router.get('/teacher.html', (req: Request, res: Response) => {
    if (req.session.ir3) {
        // log them out
        logout(req.session.ir3);
        delete req.session.ir3;
    }
    delete req.session.ir3coursedirector;
    if (!req.session.ir3teacher) {
        res.redirect(`/index.html?error=${LOGIN_TAG}`);
        return;
    }
    res.sendFile(`${__dirname}/pages/teacher.html`);
});

router.get('/courseDirector.html', (req: Request, res: Response) => {
    if (req.session.ir3) {
        // log them out
        logout(req.session.ir3);
        delete req.session.ir3;
    }
    delete req.session.ir3teacher;
    if (!req.session.ir3coursedirector) {
        res.redirect(`/index.html?error=${LOGIN_TAG}`);
        return;
    }
    res.sendFile(`${__dirname}/pages/courseDirector.html`);
});

router.get('/game.html', (req: Request, res: Response) => {
    delete req.session.ir3teacher;
    delete req.session.ir3coursedirector;
    if (!req.session.ir3) {
        res.redirect(`/index.html?error=${LOGIN_TAG}`);
        return;
    }
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, '/../react-client/build/index.html'));
    } else {
        res.redirect('http://localhost:3000'); // Use this redirect while working on react frontend
    }
});

// --------------------------------------
// Admin Functions (forms, logins, ajax)
// --------------------------------------

router.get('/databaseStatus', (req: Request, res: Response) => {
    try {
        dbStatus(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.code);
    }
});

router.post('/adminLoginVerify', (req: Request, res: Response) => {
    try {
        adminLogin(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).redirect(`/index.html?error=${DATABASE_TAG}`);
    }
});

router.post('/gameLoginVerify', (req: Request, res: Response) => {
    try {
        gameLogin(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).redirect(`./index.html?error=${DATABASE_TAG}`);
    }
});

router.post('/gameAdd', (req: Request, res: Response) => {
    try {
        gameAdd(req, res);
    } catch (error) {
        console.error(error);
        res.redirect(500, '/courseDirector.html?gameAdd=failed');
    }
});

router.post('/gameDelete', (req: Request, res: Response) => {
    try {
        gameDelete(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/courseDirector.html?gameDelete=failed');
    }
});

router.post('/setAdminPassword', (req: Request, res: Response) => {
    try {
        setAdminPassword(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/courseDirector.html?setAdminPassword=failed');
    }
});

router.post('/setTeamPasswords', (req: Request, res: Response) => {
    try {
        setTeamPasswords(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/teacher.html?setTeamPasswords=failed');
    }
});

router.post('/insertDatabaseTables', (req: Request, res: Response) => {
    try {
        insertDatabaseTables(req, res);
    } catch (error) {
        console.error(error);
        res.redirect('/courseDirector.html?initializeDatabase=failed');
    }
});

router.get('/getGames', (req: Request, res: Response) => {
    getGames(req, res); // TODO: figure this out eventually: -> try / catch is within this function, higher level catch didn't catch :(
});

router.get('/getNews', (req: Request, res: Response) => {
    getNews(req, res);
});

router.get('/getGameActive', (req: Request, res: Response) => {
    try {
        getGameActive(req, res);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.post('/toggleGameActive', (req: Request, res: Response) => {
    try {
        toggleGameActive(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/teacher.html?gameReset=failed');
    }
});

router.post('/gameReset', (req: Request, res: Response) => {
    try {
        gameReset(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/teacher.html?gameReset=failed');
    }
});

export default router;
