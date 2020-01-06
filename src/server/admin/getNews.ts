import { Request, Response } from 'express';
import { ACCESS_TAG } from '../../constants';
import { TeacherSession } from '../../types';
import { Game } from '../classes';

/**
 * Get array of news data for a particular game.
 */
export const getNews = async (req: Request, res: Response) => {
    // Verify Session
    if (!req.session.ir3teacher) {
        res.redirect(`/index.html?error=${ACCESS_TAG}`);
        return;
    }

    const { gameId } = req.session.ir3teacher as TeacherSession;

    try {
        const results = await Game.getAllNews(gameId);
        res.send(results);
    } catch (error) {
        console.error(error);
        // Manually send response if fails
        res.status(500).send([
            {
                newsId: 69,
                newsTitle: 'DATABASE FAILED'
            }
        ]);
    }
};
