// prettier-ignore
import { BLUE_TEAM_ID, EVENT_BATTLE, NOT_WAITING_STATUS, NO_MORE_EVENTS, RED_TEAM_ID } from '../../constants';
import { EventBattleAction, NoMoreEventsAction } from '../../types';
import { Battle, Game, Piece } from '../classes';
import { sendToTeam } from '../helpers';

/**
 * Find the next battle in the battleQueue and send to this team (through a socket)
 */
export const giveNextEvent = async (thisGame: Game) => {
    const { gameId } = thisGame;

    await thisGame.setStatus(BLUE_TEAM_ID, NOT_WAITING_STATUS);
    await thisGame.setStatus(RED_TEAM_ID, NOT_WAITING_STATUS);

    const gameEvent = await Battle.getNext(gameId);

    if (!gameEvent) {
        const noMoreEventsActionBlue: NoMoreEventsAction = {
            type: NO_MORE_EVENTS,
            payload: {
                gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
                gameStatus: NOT_WAITING_STATUS
            }
        };
        const noMoreEventsActionRed: NoMoreEventsAction = {
            type: NO_MORE_EVENTS,
            payload: {
                gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
                gameStatus: NOT_WAITING_STATUS
            }
        };

        sendToTeam(gameId, BLUE_TEAM_ID, noMoreEventsActionBlue);
        sendToTeam(gameId, RED_TEAM_ID, noMoreEventsActionRed);
        return;
    }

    // Giving them a fresh battle, they are no longer waiting for anything

    // send to the blue team

    const blueBattleEventItems: any = await gameEvent.getTeamItems(BLUE_TEAM_ID);
    const redBattleEventItems: any = await gameEvent.getTeamItems(RED_TEAM_ID);

    const blueFriendlyBattlePieces: any = [];
    const blueEnemyBattlePieces: any = [];
    const redFriendlyBattlePieces: any = [];
    const redEnemyBattlePieces: any = [];

    // Format for the client
    for (let x = 0; x < blueBattleEventItems.length; x++) {
        const currentBlueBattlePiece: any = {
            targetPiece: null,
            targetPieceIndex: -1
        };
        currentBlueBattlePiece.piece = blueBattleEventItems[x];
        blueFriendlyBattlePieces.push(currentBlueBattlePiece);
        redEnemyBattlePieces.push(currentBlueBattlePiece);
    }
    for (let y = 0; y < redBattleEventItems.length; y++) {
        const currentRedBattlePiece: any = {
            targetPiece: null,
            targetPieceIndex: -1
        };
        currentRedBattlePiece.piece = redBattleEventItems[y];
        blueEnemyBattlePieces.push(currentRedBattlePiece);
        redFriendlyBattlePieces.push(currentRedBattlePiece);
    }

    // Create Frontend Actions
    const eventBattleActionBlue: EventBattleAction = {
        type: EVENT_BATTLE,
        payload: {
            friendlyPieces: blueFriendlyBattlePieces,
            enemyPieces: blueEnemyBattlePieces,
            gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
            gameStatus: NOT_WAITING_STATUS
        }
    };
    const eventBattleActionRed: EventBattleAction = {
        type: EVENT_BATTLE,
        payload: {
            friendlyPieces: redFriendlyBattlePieces,
            enemyPieces: redEnemyBattlePieces,
            gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
            gameStatus: NOT_WAITING_STATUS
        }
    };

    sendToTeam(gameId, BLUE_TEAM_ID, eventBattleActionBlue);
    sendToTeam(gameId, RED_TEAM_ID, eventBattleActionRed);
};
