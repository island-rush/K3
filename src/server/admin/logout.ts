import { Game } from '../classes';
import { GameSession } from '../../types';
import { NOT_LOGGED_IN_VALUE } from '../../constants';

/**
 * Logout a person's session from a game.
 */
export const logout = async (session: GameSession) => {
    const { gameId, gameTeam, gameControllers } = session;

    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        return false;
    }

    // TODO: maybe put this in a try catch? (unlikely this function is really need to be caught and handled....)

    for (const gameController of gameControllers) {
        await thisGame.setLoggedIn(gameTeam, gameController, NOT_LOGGED_IN_VALUE);
    }

    return true;
};

export default logout;
