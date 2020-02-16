// prettier-ignore
import { BLUE_TEAM_ID, NOT_WAITING_STATUS, RED_TEAM_ID } from '../../../constants';
import { EventBattleAction, EVENT_BATTLE, NoMoreBattlesAction, NO_MORE_BATTLES } from '../../../types';
import { Battle, Game, Piece } from '../../classes';
import { sendToGame, sendToTeam, userFeedbackAction } from '../../helpers';

/**
 * Find the next battle in the battleQueue and send to this team (through a socket)
 */
export const giveNextBattle = async (thisGame: Game) => {
    const { gameId, flag0, flag1, flag11, flag12 } = thisGame;

    const battle = await Battle.getNext(gameId);

    if (!battle) {
        const NoMoreBattlesActionBlue: NoMoreBattlesAction = {
            type: NO_MORE_BATTLES,
            payload: {
                gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
                gameStatus: thisGame.getStatus(BLUE_TEAM_ID)
            }
        };
        const NoMoreBattlesActionRed: NoMoreBattlesAction = {
            type: NO_MORE_BATTLES,
            payload: {
                gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
                gameStatus: thisGame.getStatus(RED_TEAM_ID)
            }
        };

        sendToTeam(gameId, BLUE_TEAM_ID, NoMoreBattlesActionBlue);
        sendToTeam(gameId, RED_TEAM_ID, NoMoreBattlesActionRed);

        // TODO: sending multiple actions here from the server, not efficient but probably simplist...consider turning this function into a class function or helper function.
        // need the action above to send the updated piece locations, could combine and send 1 action altogether (more efficient) but might lead to messier code
        if (flag0 === BLUE_TEAM_ID && flag1 === BLUE_TEAM_ID && flag11 === RED_TEAM_ID && flag12 === RED_TEAM_ID) {
            sendToGame(gameId, userFeedbackAction('it was a tie?'));
            return;
        }
        if (flag0 === BLUE_TEAM_ID && flag1 === BLUE_TEAM_ID) {
            sendToGame(gameId, userFeedbackAction('blue team won'));
            return;
        }
        if (flag11 === RED_TEAM_ID && flag12 === RED_TEAM_ID) {
            sendToGame(gameId, userFeedbackAction('red team won'));
            return;
        }

        return;
    }

    // since there is a battle to handle, no longer 'waiting'
    await thisGame.setStatus(BLUE_TEAM_ID, NOT_WAITING_STATUS);
    await thisGame.setStatus(RED_TEAM_ID, NOT_WAITING_STATUS);

    // There is a battle to give (no targets given, battle just started)
    const { blueFriendlyBattlePieces, redFriendlyBattlePieces } = await battle.getBattleState();

    // TODO: get rid of 'event' phrasing, since now only battles
    const eventBattleActionBlue: EventBattleAction = {
        type: EVENT_BATTLE,
        payload: {
            friendlyPieces: blueFriendlyBattlePieces,
            enemyPieces: redFriendlyBattlePieces,
            gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
            gameStatus: thisGame.getStatus(BLUE_TEAM_ID) // just set to 'not waiting' above
        }
    };
    const eventBattleActionRed: EventBattleAction = {
        type: EVENT_BATTLE,
        payload: {
            friendlyPieces: redFriendlyBattlePieces,
            enemyPieces: blueFriendlyBattlePieces,
            gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
            gameStatus: thisGame.getStatus(RED_TEAM_ID)
        }
    };

    sendToTeam(gameId, BLUE_TEAM_ID, eventBattleActionBlue);
    sendToTeam(gameId, RED_TEAM_ID, eventBattleActionRed);
};
