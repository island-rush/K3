import { Game } from '../classes';
import { GameSession } from '../../types';
import { NOT_LOGGED_IN_VALUE } from '../../constants';

/**
 * Logout a person's session from a game.
 */
export const logout = async (session: GameSession) => {
    // Grab the session information
    const { gameId, gameTeam, gameControllers } = session;

    // Grab the Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        return false;
    }

    // Logout each controller value
    for (const gameController of gameControllers) {
        await thisGame.setLoggedIn(gameTeam, gameController, NOT_LOGGED_IN_VALUE);
    }

    return true; // Return type does not matter (fire and forget function)
};

export default logout;
