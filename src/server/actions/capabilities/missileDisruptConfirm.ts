// prettier-ignore
import { COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, MISSILE_LAUNCH_DISRUPTION_TYPE_ID, NOT_WAITING_STATUS, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../constants';
import { MissileDisruptAction, MissileDisruptRequestAction, MISSILE_DISRUPT_SELECTED, SocketSession } from '../../../types';
import { Capability, Game, InvItem, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User Request to use missile launch disruption on a selected missile in a silo.
 */
export const missileDisruptConfirm = async (session: SocketSession, action: MissileDisruptRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.selectedPiece == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload (missing stuff)');
        return;
    }

    const { selectedPiece, invItem } = action.payload;

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

    // gamePhase 2 is only phase for missile launch disrupt
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for missile launch disrupt
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    // Only the main controller (0) can use missile launch disrupt
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

    // Does the selected missile exist for it?
    const thisMissile = await new Piece(selectedPiece.pieceId).init();
    if (!thisMissile) {
        sendUserFeedback(socketId, 'Did not have the enemy missile to complete this request.');
        return;
    }

    // verify correct type of inv item
    const { invItemTypeId } = thisInvItem;
    if (invItemTypeId !== MISSILE_LAUNCH_DISRUPTION_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a missile launch disrupt type.');
        return;
    }

    // insert the 'plan' for missile disrupt into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.insertMissileDisrupt(gameId, gameTeam, thisMissile))) {
        sendUserFeedback(socketId, 'db failed to insert missile disrupt, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    const serverAction: MissileDisruptAction = {
        type: MISSILE_DISRUPT_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPiece: thisMissile
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
