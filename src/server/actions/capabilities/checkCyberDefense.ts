// prettier-ignore
import { BLUE_TEAM_ID, COMBAT_PHASE_ID, CYBER_DEFENSE_CHECK, CYBER_DOM_CHECK_TYPE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, RED_TEAM_ID, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../constants';
import { CyberDefenseCheckAction, CyberDefenseCheckRequest, SocketSession } from '../../../types';
import { Capability, Game, InvItem } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use check for enemy cyber defense
 */
export const checkCyberDefense = async (session: SocketSession, action: CyberDefenseCheckRequest) => {
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
    if (invItemTypeId !== CYBER_DOM_CHECK_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a cyber defense check type.');
        return;
    }

    await thisInvItem.delete();

    const otherTeam = gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;
    const isActive = await Capability.getCyberDefense(gameId, otherTeam);

    const serverAction: CyberDefenseCheckAction = {
        type: CYBER_DEFENSE_CHECK,
        payload: {
            isActive,
            invItem: thisInvItem
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
