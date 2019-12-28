import { Socket } from 'socket.io';
// prettier-ignore
import { COMBAT_PHASE_ID, COMMUNICATIONS_INTERRUPTION_TYPE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, SLICE_PLANNING_ID, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION, TYPE_MAIN } from '../../../constants';
import { COMM_INTERRUP_SELECTED } from '../../../react-client/src/redux/actions/actionTypes';
import { CommInterruptAction, CommInterruptRequestAction, GameSession } from '../../../types';
import { Capability, Game, InvItem } from '../../classes';
import { sendUserFeedback } from '../sendUserFeedback';

/**
 * User Request to use CommInterrupt capability.
 */
export const commInterruptConfirm = async (socket: Socket, action: CommInterruptRequestAction) => {
    // Grab Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    if (action.payload == null || action.payload.selectedPositionId == null) {
        sendUserFeedback(socket, 'Server Error: Malformed Payload (missing selectedPositionId)');
        return;
    }

    const { selectedPositionId, invItem } = action.payload;

    // Get the Game
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

    // gamePhase 2 is only phase for comm interrupt
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socket, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for comm interrupt
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socket, 'Not the right slice (must be planning)...');
        return;
    }

    // Only the main controller (0) can use comm interrupt
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
    if (invItemTypeId !== COMMUNICATIONS_INTERRUPTION_TYPE_ID) {
        sendUserFeedback(socket, 'Inv Item was not a comm interrupt type.');
        return;
    }

    // does the position make sense?
    if (selectedPositionId < 0) {
        sendUserFeedback(socket, 'got a negative position for comm interrupt.');
        return;
    }

    // insert the 'plan' for comm interrupt into the db for later use
    if (!(await Capability.insertCommInterrupt(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socket, 'db failed to insert comm interrupt, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    const confirmedCommInterrupt = await Capability.getCommInterrupt(gameId, gameTeam);

    // let the client(team) know that this plan was accepted
    const serverAction: CommInterruptAction = {
        type: COMM_INTERRUP_SELECTED,
        payload: {
            invItem: thisInvItem,
            confirmedCommInterrupt
        }
    };

    // Send the update to the client(s)
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default commInterruptConfirm;
