// prettier-ignore
import { ANTISAT_TIME_TO_HIT, BLUE_TEAM_ID, COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, RED_TEAM_ID, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../constants';
// prettier-ignore
import { AntiSatAction, AntiSatHitAction, AntiSatRequestAction, ANTISAT_HIT_ACTION, ANTISAT_SELECTED, RemoteSensingHitAction, REMOTE_SENSING_HIT_ACTION, SocketSession } from '../../../types';
import { Capability, Game, InvItem, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use anti sat missiles.
 */
export const antiSatConfirm = async (session: SocketSession, action: AntiSatRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.invItem == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload');
        return;
    }

    const { invItem } = action.payload;

    // Get the Game
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

    // gamePhase 2 is only phase for anti sat
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for anti sat
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    // Only the main controller
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socketId, 'Not the main controller (0)...');
        return;
    }

    // Does the invItem exist for it?
    const thisInvItem = await new InvItem(invItem.invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socketId, 'Did not have the inv item anti sat to complete this request.');
        return;
    }

    // good to go
    const antiSatId = await Capability.insertAntiSat(gameId, gameTeam);

    // used the inv item, get rid of it
    await thisInvItem.delete();

    // sending anti-sat action
    const serverAction: AntiSatAction = {
        type: ANTISAT_SELECTED,
        payload: {
            invItem: thisInvItem // TODO: check that methods aren't getting send to server as well, only need the data
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);

    const otherTeam = gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

    setTimeout(async () => {
        const remoteSensingPosHit = await Capability.checkAntiSatHit(gameId, gameTeam, antiSatId);
        if (remoteSensingPosHit !== -1) {
            const antiSatSuccessAction: AntiSatHitAction = {
                type: ANTISAT_HIT_ACTION,
                payload: {
                    positionOfRemoteHit: remoteSensingPosHit
                }
            };

            sendToTeam(gameId, gameTeam, antiSatSuccessAction);

            const remoteSensingHitAction: RemoteSensingHitAction = {
                type: REMOTE_SENSING_HIT_ACTION,
                payload: {
                    gameboardPieces: await Piece.getVisiblePieces(gameId, otherTeam),
                    positionOfRemoteHit: remoteSensingPosHit
                }
            };

            sendToTeam(gameId, otherTeam, remoteSensingHitAction);
        }
    }, ANTISAT_TIME_TO_HIT);
};
