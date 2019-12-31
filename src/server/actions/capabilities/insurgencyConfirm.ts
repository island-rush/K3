import { Socket } from 'socket.io';
// prettier-ignore
import { COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, INSURGENCY_SELECTED, INSURGENCY_TYPE_ID, SLICE_PLANNING_ID, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION, TYPE_MAIN } from '../../../constants';
import { GameSession, InsurgencyAction, InsurgencyRequestAction } from '../../../types';
import { Capability, Game, InvItem } from '../../classes';
import { sendUserFeedback } from '../sendUserFeedback';

/**
 * User Request to use Insurgency Capability
 */
export const insurgencyConfirm = async (socket: Socket, action: InsurgencyRequestAction) => {
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

    // gamePhase 2 is only phase for insurgency
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socket, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for insurgency
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socket, 'Not the right slice (must be planning)...');
        return;
    }

    // Only the main controller (0) can use insurgency
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
    if (invItemTypeId !== INSURGENCY_TYPE_ID) {
        sendUserFeedback(socket, 'Inv Item was not a insurgency type.');
        return;
    }

    // does the position make sense?
    if (selectedPositionId < 0) {
        sendUserFeedback(socket, 'got a negative position for insurgency.');
        return;
    }

    // insert the 'plan' for insurgency into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.insurgencyInsert(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socket, 'db failed to insert insurgency, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    const serverAction: InsurgencyAction = {
        type: INSURGENCY_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPositionId
        }
    };

    // Send the update to the client(s)
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};
