// prettier-ignore
import { ALL_AIRFIELD_LOCATIONS, ATC_SCRAMBLE_TYPE_ID, COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../constants';
import { AtcScrambleAction, AtcScrambleRequestAction, ATC_SCRAMBLE_SELECTED, SocketSession } from '../../../types';
import { Capability, Game, InvItem } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use atc scramble capability.
 */
export const atcScrambleConfirm = async (session: SocketSession, action: AtcScrambleRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.selectedPositionId == null || action.payload.invItem == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload');
        return;
    }

    const { invItem, selectedPositionId } = action.payload;

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

    // gamePhase 2 is only phase for atc scramble
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for atc scramble
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
        sendUserFeedback(socketId, 'Not the main controller (cocom)...');
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
    if (invItemTypeId !== ATC_SCRAMBLE_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a atc scramble type.');
        return;
    }

    // verify position is an airfield
    if (!ALL_AIRFIELD_LOCATIONS.includes(selectedPositionId)) {
        sendUserFeedback(socketId, 'selected position was not an airfield spot.');
        return;
    }

    // insert the 'plan' for bio weapon into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.insertAtcScramble(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socketId, 'db failed to insert atc scramble, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    const serverAction: AtcScrambleAction = {
        type: ATC_SCRAMBLE_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPositionId
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
