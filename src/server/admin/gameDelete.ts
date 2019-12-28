import { Request, Response } from 'express';
import { ACCESS_TAG } from '../../constants';
import { Game } from '../classes';

/**
 * Delete a game from an express route /gameDelete
 */
export const gameDelete = async (req: Request, res: Response) => {
    // Verify Session Exists
    if (!req.session.ir3coursedirector) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    // Verify Request
    if (!req.body.gameId) {
        res.status(400).redirect('/courseDirector.html?gameDelete=failed');
        return;
    }

    const { gameId }: GameDeleteRequest = req.body;

    // Get the Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        res.status(400).redirect('/courseDirector.html?gameDelete=failed');
        return;
    }

    await thisGame.delete();

    res.redirect('/courseDirector.html?gameDelete=success');
};

/**
 * All the values needed for a gameDelete request.
 */
type GameDeleteRequest = {
    gameId: number;
};

export default gameDelete;
