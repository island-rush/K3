// prettier-ignore
import { COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, SEA_MINES_TYPE_ID, SLICE_PLANNING_ID, TYPE_SEA, TRANSPORT_TYPE_ID, SEA_MINE_SELECTED } from '../../../constants';
import { SeaMineRequestAction, SocketSession, SeaMineAction } from '../../../types';
import { Game, InvItem, Piece, Capability } from '../../classes';
import { redirectClient, sendUserFeedback, sendToTeam } from '../../helpers';

/**
 * User request to use SeaMine capability.
 */
export const seaMineConfirm = async (session: SocketSession, action: SeaMineRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.selectedPiece == null || action.payload.invItem == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload');
        return;
    }

    const { invItem, selectedPiece } = action.payload;

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

    // gamePhase 2 is only phase for sea mine
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for sea mine
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // Only the sea controller
    if (!gameControllers.includes(TYPE_SEA)) {
        sendUserFeedback(socketId, 'Not the sea controller (0)...');
        return;
    }

    const { invItemId } = invItem;

    // Does the invItem exist for it?
    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socketId, 'Did not have the invItem to complete this request.');
        return;
    }

    const { pieceId } = selectedPiece;

    // Does the selectedPiece exist for it? // TODO: could do additional checks on the piece in the payload before making network request to get the actual info (if they sent a non-transport selected, doesn't pay to actually check if it was a transport...)
    const thisSelectedPiece = await new Piece(pieceId).init();
    if (!thisSelectedPiece) {
        sendUserFeedback(socketId, 'Selected piece (transport) did not exist.');
        return;
    }

    // TODO: ideally would also check that the gameIds match, but how would they know about the piece? (possibly update all other requests to check this...)
    if (thisSelectedPiece.pieceTeamId !== gameTeam) {
        sendUserFeedback(socketId, 'Selected piece did not belong to your team.');
        return;
    }

    // verify correct type of inv item
    const { invItemTypeId } = thisInvItem;
    if (invItemTypeId !== SEA_MINES_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a sea mine type.');
        return;
    }

    // verify correct type of selected piece
    const { pieceTypeId, piecePositionId } = thisSelectedPiece;
    if (pieceTypeId !== TRANSPORT_TYPE_ID) {
        sendUserFeedback(socketId, 'selected piece was not a transport.');
        return;
    }

    // insert the 'plan' for bio weapon into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.insertSeaMine(gameId, gameTeam, piecePositionId))) {
        sendUserFeedback(socketId, 'db failed to insert sea mine, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    const serverAction: SeaMineAction = {
        type: SEA_MINE_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPositionId: piecePositionId
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
