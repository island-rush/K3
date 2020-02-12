// prettier-ignore
import { COMBAT_PHASE_ID, CYBER_DEFENSE_SELECTED, CYBER_DOMINANCE_TYPE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, SLICE_PLANNING_ID, TYPE_MAIN, NOT_WAITING_STATUS } from '../../../constants';
import { CyberDefenseAction, CyberDefenseRequestAction, SocketSession } from '../../../types';
import { Capability, Game, InvItem } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use cyber defense
 */
export const cyberDefenseConfirm = async (session: SocketSession, action: CyberDefenseRequestAction) => {
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

    // gamePhase 2 is only phase for cyber defense
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for cyber defense
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
        sendUserFeedback(socketId, 'Not the main controller...');
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
    if (invItemTypeId !== CYBER_DOMINANCE_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a cyber defense type.');
        return;
    }

    // insert the 'plan' for bio weapon into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.insertCyberDefense(gameId, gameTeam))) {
        sendUserFeedback(socketId, 'db failed to insert cyber defense, possibly already an entry');
        return;
    }

    await thisInvItem.delete();

    const serverAction: CyberDefenseAction = {
        type: CYBER_DEFENSE_SELECTED,
        payload: {
            invItem: thisInvItem
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
