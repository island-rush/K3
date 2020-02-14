// prettier-ignore
import { BLUE_TEAM_ID, EVENT_BATTLE, NOT_WAITING_STATUS, NO_MORE_BATTLES, RED_TEAM_ID } from '../../../constants';
import { EventBattleAction, NoMoreBattlesAction } from '../../../types';
import { Battle, Game, Piece } from '../../classes';
import { sendToTeam } from '../../helpers';

/**
 * Find the next battle in the battleQueue and send to this team (through a socket)
 */
export const giveNextBattle = async (thisGame: Game) => {
    const { gameId } = thisGame;

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
        return;
    }

    // since there is a battle to handle, no longer 'waiting'
    await thisGame.setStatus(BLUE_TEAM_ID, NOT_WAITING_STATUS);
    await thisGame.setStatus(RED_TEAM_ID, NOT_WAITING_STATUS);

    // There is a battle to give
    const blueBattleEventItems: any = await battle.getTeamItems(BLUE_TEAM_ID);
    const redBattleEventItems: any = await battle.getTeamItems(RED_TEAM_ID);

    const blueFriendlyBattlePieces: any = [];
    const blueEnemyBattlePieces: any = [];
    const redFriendlyBattlePieces: any = [];
    const redEnemyBattlePieces: any = [];

    // Format for the client with extra properties
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
    // TODO: get rid of 'event' phrasing, since now only battles
    const eventBattleActionBlue: EventBattleAction = {
        type: EVENT_BATTLE,
        payload: {
            friendlyPieces: blueFriendlyBattlePieces,
            enemyPieces: blueEnemyBattlePieces,
            gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
            gameStatus: thisGame.getStatus(BLUE_TEAM_ID) // just set to 'not waiting' above
        }
    };
    const eventBattleActionRed: EventBattleAction = {
        type: EVENT_BATTLE,
        payload: {
            friendlyPieces: redFriendlyBattlePieces,
            enemyPieces: redEnemyBattlePieces,
            gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
            gameStatus: thisGame.getStatus(RED_TEAM_ID)
        }
    };

    sendToTeam(gameId, BLUE_TEAM_ID, eventBattleActionBlue);
    sendToTeam(gameId, RED_TEAM_ID, eventBattleActionRed);
};
