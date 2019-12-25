import { Socket } from 'socket.io';
import { COMBAT_PHASE_ID, RODS_FROM_GOD_TYPE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../react-client/src/constants/gameConstants';
import { RodsFromGodAction, RodsFromGodRequestAction } from '../../../react-client/src/interfaces/interfaces';
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../../../react-client/src/constants/otherConstants';
import { RODS_FROM_GOD_SELECTED } from '../../../react-client/src/redux/actions/actionTypes';
import { Capability, Game, InvItem } from '../../classes';
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG } from '../../pages/errorTypes';
import sendUserFeedback from '../sendUserFeedback';
import { GameSession } from '../../../types/sessionTypes';

// TODO: does this affect all pieces? or only ground since that makes sense....(compare to bio weapons)
/**
 * User Request to use rods from god on a certain position.
 */
export const rodsFromGodConfirm = async (socket: Socket, action: RodsFromGodRequestAction) => {
    // Grab the Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    if (action.payload == null || action.payload.selectedPositionId == null) {
        sendUserFeedback(socket, 'Server Error: Malformed Payload (missing selectedPositionId)');
        return;
    }

    const { selectedPositionId, invItem } = action.payload;

    // Grab the Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    // gamePhase 2 is only phase for rods from god
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socket, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for rods from god
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socket, 'Not the right slice (must be planning)...');
        return;
    }

    // Only the main controller (0) can use rods from god
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, 'Not the main controller (0)...');
        return;
    }

    const { invItemId } = invItem;

    // Does the invItem exist for it?
    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socket, 'Did not have the invItem to complete this request.');
        return;
    }

    // verify correct type of inv item
    const { invItemTypeId } = thisInvItem;
    if (invItemTypeId !== RODS_FROM_GOD_TYPE_ID) {
        sendUserFeedback(socket, 'Inv Item was not a rods from god type.');
        return;
    }

    // does the position make sense?
    if (selectedPositionId < 0) {
        sendUserFeedback(socket, 'got a negative position for rods from god.');
        return;
    }

    // insert the 'plan' for rods from god into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.rodsFromGodInsert(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socket, 'db failed to insert rods from god, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    const serverAction: RodsFromGodAction = {
        type: RODS_FROM_GOD_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPositionId
        }
    };

    // Send the update to the client(s)
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default rodsFromGodConfirm;
