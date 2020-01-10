import { Socket } from 'socket.io';
// prettier-ignore
import { BLUE_TEAM_ID, COMBAT_PHASE, COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, MAIN_BUTTON_CLICK, NEWS_PHASE, NEWS_PHASE_ID, NOT_WAITING_STATUS, PURCHASE_PHASE, PURCHASE_PHASE_ID, RED_TEAM_ID, SLICE_CHANGE, SLICE_EXECUTING_ID, TYPE_MAIN, WAITING_STATUS } from '../../constants';
// prettier-ignore
import { CombatPhaseAction, GameSession, MainButtonClickAction, NewsPhaseAction, PurchasePhaseAction, SliceChangeAction } from '../../types';
import { Capability, Game, Piece } from '../classes';
import { redirectClient, sendToClient, sendToGame, sendToTeam, sendUserFeedback } from '../helpers';
import { executeStep } from './executeStep';

export const mainButtonClick = async (socket: Socket) => {
    // Grab Session
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3 as GameSession;

    // Get Game
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        redirectClient(socket, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice, gameBlueStatus, gameRedStatus } = thisGame;

    if (!gameActive) {
        redirectClient(socket, GAME_INACTIVE_TAG);
        return;
    }

    // Who is allowed to press that button?
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, 'Wrong Controller to click that button...');
        return;
    }

    const otherTeam = gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;
    const thisTeamStatus = gameTeam === BLUE_TEAM_ID ? gameBlueStatus : gameRedStatus;
    const otherTeamStatus = otherTeam === BLUE_TEAM_ID ? gameBlueStatus : gameRedStatus;

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
        sendToClient(socket, serverAction);
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
        sendToGame(socket, purchasePhaseAction);
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

        const combatPhaseActionBlue = JSON.parse(JSON.stringify(combatPhaseAction));
        const combatPhaseActionRed = JSON.parse(JSON.stringify(combatPhaseAction));
        combatPhaseActionBlue.payload.gameboardPieces = await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID);
        combatPhaseActionRed.payload.gameboardPieces = await Piece.getVisiblePieces(gameId, RED_TEAM_ID);

        sendToTeam(socket, BLUE_TEAM_ID, combatPhaseActionBlue);
        sendToTeam(socket, RED_TEAM_ID, combatPhaseActionRed);
        return;
    }

    // Combat Phase === Planning -> execute || execute -> execute
    if (gamePhase === COMBAT_PHASE_ID) {
        if (gameSlice === SLICE_EXECUTING_ID) {
            await executeStep(socket, thisGame);
            return; // executeStep will handle sending socket stuff, most likely separate for each client
        }

        await thisGame.setSlice(SLICE_EXECUTING_ID);

        await Piece.removeFuelForLoitering(gameId);

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

        const sliceChangeActionBlue = JSON.parse(JSON.stringify(sliceChangeAction));
        const sliceChangeActionRed = JSON.parse(JSON.stringify(sliceChangeAction));
        sliceChangeActionBlue.payload.gameboardPieces = await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID);
        sliceChangeActionRed.payload.gameboardPieces = await Piece.getVisiblePieces(gameId, RED_TEAM_ID);

        sendToTeam(socket, BLUE_TEAM_ID, sliceChangeActionBlue);
        sendToTeam(socket, RED_TEAM_ID, sliceChangeActionRed);
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

    const newsPhaseActionBlue = JSON.parse(JSON.stringify(newsPhaseAction));
    const newsPhaseActionRed = JSON.parse(JSON.stringify(newsPhaseAction));
    newsPhaseActionBlue.payload.gamePoints = thisGame.gameBluePoints;
    newsPhaseActionRed.payload.gamePoints = thisGame.gameRedPoints;

    sendToTeam(socket, BLUE_TEAM_ID, newsPhaseActionBlue);
    sendToTeam(socket, RED_TEAM_ID, newsPhaseActionRed);
};
