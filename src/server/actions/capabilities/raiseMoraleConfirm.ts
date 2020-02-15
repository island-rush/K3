// prettier-ignore
import { ALL_COMMANDER_TYPES, COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, RAISE_MORALE_TYPE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../constants';
import { RaiseMoraleAction, RaiseMoraleRequestAction, RAISE_MORALE_SELECTED, SocketSession } from '../../../types';
import { Capability, Game, InvItem, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use Raise Morale capability on a set of troops for a commander.
 */
export const raiseMoraleConfirm = async (session: SocketSession, action: RaiseMoraleRequestAction) => {
    // Grab Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.selectedCommanderType == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload (missing selectedCommanderType)');
        return;
    }

    const { selectedCommanderType, invItem } = action.payload;

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

    // gamePhase 2 is only phase for raise morale
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for raise morale
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    // Only the main controller (0) can use raise morale
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
    if (invItemTypeId !== RAISE_MORALE_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a raise morale type.');
        return;
    }

    // does the commander selection make sense?
    if (!ALL_COMMANDER_TYPES.includes(selectedCommanderType)) {
        sendUserFeedback(socketId, 'got a negative position for raise morale.');
        return;
    }

    // insert the raise morale into the db to start using it
    if (!(await Capability.insertRaiseMorale(gameId, gameTeam, selectedCommanderType))) {
        sendUserFeedback(socketId, 'db failed to insert raise morale, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    const gameboardPieces = await Piece.getVisiblePieces(gameId, gameTeam);
    const confirmedRaiseMorale = await Capability.getRaiseMorale(gameId, gameTeam);

    // let the client(team) know that this plan was accepted
    const serverAction: RaiseMoraleAction = {
        type: RAISE_MORALE_SELECTED,
        payload: {
            invItem: thisInvItem,
            confirmedRaiseMorale,
            gameboardPieces
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
