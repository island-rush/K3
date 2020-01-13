// prettier-ignore
import { COMBAT_PHASE_ID, COMMUNICATIONS_INTERRUPTION_TYPE_ID, COMM_INTERRUP_SELECTED, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../constants';
import { CommInterruptAction, CommInterruptRequestAction, SocketSession } from '../../../types';
import { Capability, Game, InvItem } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User Request to use CommInterrupt capability.
 */
export const commInterruptConfirm = async (session: SocketSession, action: CommInterruptRequestAction) => {
    // Grab Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.selectedPositionId == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload (missing selectedPositionId)');
        return;
    }

    const { selectedPositionId, invItem } = action.payload;

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

    // gamePhase 2 is only phase for comm interrupt
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for comm interrupt
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // Only the main controller (0) can use comm interrupt
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
    if (invItemTypeId !== COMMUNICATIONS_INTERRUPTION_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a comm interrupt type.');
        return;
    }

    // does the position make sense?
    if (selectedPositionId < 0) {
        sendUserFeedback(socketId, 'got a negative position for comm interrupt.');
        return;
    }

    // insert the 'plan' for comm interrupt into the db for later use
    if (!(await Capability.insertCommInterrupt(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socketId, 'db failed to insert comm interrupt, likely already an entry for that position.');
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
    sendToTeam(gameId, gameTeam, serverAction);
};
