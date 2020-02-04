// prettier-ignore
import { LIST_ALL_POSITIONS, ANTISAT_HIT_ACTION, ANTISAT_TIME_TO_HIT, BLUE_TEAM_ID, COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, RED_TEAM_ID, REMOTE_SENSING_HIT_ACTION, REMOTE_SENSING_SELECTED, REMOTE_SENSING_TYPE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../constants';
import { AntiSatHitAction, RemoteSensingAction, RemoteSensingHitAction, RemoteSensingRequestAction, SocketSession } from '../../../types';
import { Capability, Game, InvItem, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use remote sensing capability on a position.
 */
export const remoteSensingConfirm = async (session: SocketSession, action: RemoteSensingRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.selectedPositionId == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload (missing selectedPositionId)');
        return;
    }

    const { selectedPositionId, invItem } = action.payload;

    // Grab the Game
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        redirectClient(socketId, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        redirectClient(socketId, GAME_INACTIVE_TAG);
        return;
    }

    // gamePhase 2 is only phase for remote sensing
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for remote sensing
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // Only the main controller (0) can use remote sensing
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socketId, 'Not the main controller (0)...');
        return;
    }

    const { invItemId } = invItem;

    // Does the invItem exist for it?
    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socketId, 'Did not have the invItem to complete this request.');
        return;
    }

    // verify correct type of inv item
    const { invItemTypeId } = thisInvItem;
    if (invItemTypeId !== REMOTE_SENSING_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a remote sensing type.');
        return;
    }

    // does the position make sense?
    if (!LIST_ALL_POSITIONS.includes(selectedPositionId)) {
        sendUserFeedback(socketId, 'got a negative position for remote sensing.');
        return;
    }

    // insert the 'plan' for remote sensing into the db for later use

    const remoteSensingId = await Capability.remoteSensingInsert(gameId, gameTeam, selectedPositionId);

    if (!remoteSensingId) {
        sendUserFeedback(socketId, 'db failed to insert remote sensing, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    await Piece.updateVisibilities(gameId);
    const gameboardPieces = await Piece.getVisiblePieces(gameId, gameTeam);
    const confirmedRemoteSense = await Capability.getRemoteSensing(gameId, gameTeam);

    // let the client(team) know that this plan was accepted
    const serverAction: RemoteSensingAction = {
        type: REMOTE_SENSING_SELECTED,
        payload: {
            invItem: thisInvItem,
            confirmedRemoteSense,
            gameboardPieces
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);

    const otherTeam = gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

    setTimeout(async () => {
        const remoteSensingPosHit = await Capability.checkRemoteSensingHit(gameId, gameTeam, remoteSensingId, selectedPositionId);
        if (remoteSensingPosHit !== -1) {
            // TODO: use constant instead of -1 (NEGATIVE_RESULT...idk)
            const antiSatSuccessAction: AntiSatHitAction = {
                type: ANTISAT_HIT_ACTION,
                payload: {
                    positionOfRemoteHit: remoteSensingPosHit
                }
            };

            sendToTeam(gameId, otherTeam, antiSatSuccessAction);

            const remoteSensingHitAction: RemoteSensingHitAction = {
                type: REMOTE_SENSING_HIT_ACTION,
                payload: {
                    gameboardPieces: await Piece.getVisiblePieces(gameId, otherTeam),
                    positionOfRemoteHit: remoteSensingPosHit
                }
            };

            sendToTeam(gameId, gameTeam, remoteSensingHitAction);
        }
    }, ANTISAT_TIME_TO_HIT);
};
