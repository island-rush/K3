import { Request, Response } from 'express';
import { ACCESS_TAG, GAME_DOES_NOT_EXIST } from '../../constants';
import { TeacherSession } from '../../types';
import { Game } from '../classes';

/**
 * Reset a game from an express route /gameReset
 */
export const gameReset = async (req: Request, res: Response) => {
    // Verify Session
    if (!req.session.ir3teacher) {
        res.status(403).redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    const { gameId }: TeacherSession = req.session.ir3teacher;

    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        res.status(404).redirect(`/index.html?error=${GAME_DOES_NOT_EXIST}`);
        return;
    }

    await thisGame.reset();

    res.redirect('/teacher.html?gameReset=success');
};

export default gameReset;
