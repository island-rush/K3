import { Socket } from 'socket.io';
// prettier-ignore
import { BLUE_TEAM_ID, COMBAT_PHASE_ID, NEWS_PHASE_ID, NOT_WAITING_STATUS, PURCHASE_PHASE_ID, RED_TEAM_ID, SLICE_EXECUTING_ID, TYPE_MAIN, WAITING_STATUS } from '../../react-client/src/constants/gameConstants';
// prettier-ignore
import { CombatPhaseAction, MainButtonClickAction, NewsPhaseAction, PurchasePhaseAction, SliceChangeAction } from '../../react-client/src/interfaces/interfaces';
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../../react-client/src/constants/otherConstants';
import { COMBAT_PHASE, MAIN_BUTTON_CLICK, NEWS_PHASE, PURCHASE_PHASE, SLICE_CHANGE } from '../../react-client/src/redux/actions/actionTypes';
import { Capability, Game, Piece } from '../classes';
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG } from '../pages/errorTypes';
import executeStep from './executeStep';
import sendUserFeedback from './sendUserFeedback';
import { GameSession } from '../../types/sessionTypes';

export const mainButtonClick = async (socket: Socket) => {
    // Grab Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    // Get Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice, game0Status, game1Status } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    // Who is allowed to press that button?
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, 'Wrong Controller to click that button...');
        return;
    }

    const otherTeam = gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;
    const thisTeamStatus = gameTeam === BLUE_TEAM_ID ? game0Status : game1Status;
    const otherTeamStatus = otherTeam === BLUE_TEAM_ID ? game0Status : game1Status;

    if (thisTeamStatus === WAITING_STATUS) {
        // might fail with race condition (they press at the same time...but they just need to keep pressing...)
        sendUserFeedback(socket, 'Still waiting on other team...');
        return;
    }

    // Now Waiting
    if (otherTeamStatus === NOT_WAITING_STATUS) {
        await thisGame.setStatus(gameTeam, WAITING_STATUS);
        const serverAction: MainButtonClickAction = {
            type: MAIN_BUTTON_CLICK
        };
        socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
        return;
    }

    // Everyone is ready to move on
    await thisGame.setStatus(otherTeam, NOT_WAITING_STATUS);
    await thisGame.setStatus(gameTeam, NOT_WAITING_STATUS);

    if (gamePhase === NEWS_PHASE_ID) {
        await thisGame.setPhase(PURCHASE_PHASE_ID);

        const purchasePhaseAction: PurchasePhaseAction = {
            type: PURCHASE_PHASE
        };

        // Same update to all client(s)
        socket.to(`game${gameId}`).emit(SOCKET_SERVER_SENDING_ACTION, purchasePhaseAction);
        socket.emit(SOCKET_SERVER_SENDING_ACTION, purchasePhaseAction);
        return;
    }

    if (gamePhase === PURCHASE_PHASE_ID) {
        await thisGame.setPhase(COMBAT_PHASE_ID);

        // probably do this again anyway (pieces have been placed and could be seeing things now)
        await Piece.updateVisibilities(gameId);

        const combatPhaseAction: CombatPhaseAction = {
            type: COMBAT_PHASE,
            payload: {
                gameboardPieces: []
            }
        };

        const combatPhaseAction0 = JSON.parse(JSON.stringify(combatPhaseAction));
        const combatPhaseAction1 = JSON.parse(JSON.stringify(combatPhaseAction));
        combatPhaseAction0.payload.gameboardPieces = await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID);
        combatPhaseAction1.payload.gameboardPieces = await Piece.getVisiblePieces(gameId, RED_TEAM_ID);

        socket.to(`game${gameId}team${BLUE_TEAM_ID}`).emit(SOCKET_SERVER_SENDING_ACTION, combatPhaseAction0);
        socket.to(`game${gameId}team${RED_TEAM_ID}`).emit(SOCKET_SERVER_SENDING_ACTION, combatPhaseAction1);
        socket.emit(SOCKET_SERVER_SENDING_ACTION, gameTeam === BLUE_TEAM_ID ? combatPhaseAction0 : combatPhaseAction1);
        return;
    }

    // Combat Phase === Planning -> execute || execute -> execute
    if (gamePhase === COMBAT_PHASE_ID) {
        if (gameSlice === SLICE_EXECUTING_ID) {
            await executeStep(socket, thisGame);
            return; // executeStep will handle sending socket stuff, most likely separate for each client
        }

        await thisGame.setSlice(SLICE_EXECUTING_ID);

        const { listOfPiecesToKill, listOfEffectedPositions } = await Capability.useInsurgency(gameId);

        const sliceChangeAction: SliceChangeAction = {
            type: SLICE_CHANGE,
            payload: {
                confirmedRods: await Capability.useRodsFromGod(gameId),
                confirmedBioWeapons: await Capability.useBiologicalWeapons(gameId),
                confirmedGoldenEye: await Capability.useGoldenEye(gameId),
                confirmedCommInterrupt: await Capability.useCommInterrupt(gameId),
                confirmedInsurgencyPos: listOfEffectedPositions,
                confirmedInsurgencyPieces: listOfPiecesToKill,
                gameboardPieces: []
            }
        };

        const sliceChangeAction0 = JSON.parse(JSON.stringify(sliceChangeAction));
        const sliceChangeAction1 = JSON.parse(JSON.stringify(sliceChangeAction));
        sliceChangeAction0.payload.gameboardPieces = await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID);
        sliceChangeAction1.payload.gameboardPieces = await Piece.getVisiblePieces(gameId, RED_TEAM_ID);

        socket.to(`game${gameId}team${BLUE_TEAM_ID}`).emit(SOCKET_SERVER_SENDING_ACTION, sliceChangeAction0);
        socket.to(`game${gameId}team${RED_TEAM_ID}`).emit(SOCKET_SERVER_SENDING_ACTION, sliceChangeAction1);
        socket.emit(SOCKET_SERVER_SENDING_ACTION, gameTeam === BLUE_TEAM_ID ? sliceChangeAction0 : sliceChangeAction1);
        return;
    }

    // If none of the other phases, must be in Place Phase

    await thisGame.addPoints();
    await thisGame.setPhase(NEWS_PHASE_ID);

    const newsPhaseAction: NewsPhaseAction = {
        type: NEWS_PHASE,
        payload: {
            news: await thisGame.getNextNews(),
            gamePoints: -1
        }
    };

    const newsPhaseAction0 = JSON.parse(JSON.stringify(newsPhaseAction));
    const newsPhaseAction1 = JSON.parse(JSON.stringify(newsPhaseAction));
    newsPhaseAction0.payload.gamePoints = thisGame.game0Points;
    newsPhaseAction1.payload.gamePoints = thisGame.game1Points;

    socket.to(`game${gameId}team${BLUE_TEAM_ID}`).emit(SOCKET_SERVER_SENDING_ACTION, newsPhaseAction0);
    socket.to(`game${gameId}team${RED_TEAM_ID}`).emit(SOCKET_SERVER_SENDING_ACTION, newsPhaseAction1);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, gameTeam === BLUE_TEAM_ID ? newsPhaseAction0 : newsPhaseAction1);
};

export default mainButtonClick;
