// prettier-ignore
import { BOMBARDMENT_SELECTED, COMBAT_PHASE_ID, DESTROYER_ATTACK_RANGE_CHANCE, DESTROYER_TYPE_ID, distanceMatrix, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, SLICE_PLANNING_ID, TYPE_LAND, TYPE_OWNERS, TYPE_SEA } from '../../../constants';
import { BombardmentAction, BombardmentRequestAction, SocketSession } from '../../../types';
import { Capability, Game, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use bombardment.
 */
export const bombardmentConfirm = async (session: SocketSession, action: BombardmentRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.selectedPiece == null || action.payload.selectedTargetPiece == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload');
        return;
    }

    const { selectedTargetPiece, selectedPiece } = action.payload;

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

    // gamePhase 2 is only phase for bombardment attack
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for bombardment attack
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // Only the SOF controller
    if (!gameControllers.includes(TYPE_SEA)) {
        sendUserFeedback(socketId, 'Not the sea controller...');
        return;
    }

    // Does the invItem exist for it?
    const destroyerPiece = await new Piece(selectedPiece.pieceId).init();
    if (!destroyerPiece) {
        sendUserFeedback(socketId, 'Did not have the destroyer piece to complete this request.');
        return;
    }

    const targetPiece = await new Piece(selectedTargetPiece.pieceId).init();
    if (!targetPiece) {
        sendUserFeedback(socketId, 'Target piece did not exist.');
        return;
    }

    // TODO: tons more of checks that could happen here to verify that piece's belong to correct teams and things make sense for this action
    if (destroyerPiece.pieceTeamId !== gameTeam) {
        sendUserFeedback(socketId, 'Selected piece did not belong to your team.');
        return;
    }

    // verify correct type of piece (destroyer)
    if (destroyerPiece.pieceTypeId !== DESTROYER_TYPE_ID) {
        sendUserFeedback(socketId, 'selected piece was not a destroyer type.');
        return;
    }

    // verify correct type of target
    // TODO: what are the ranges / capabilities of what targets are available (does distance factor into % hit?)
    // TODO: should we include a more specific set? (ability to bombard helicopters?)
    if (!TYPE_OWNERS[TYPE_LAND].includes(targetPiece.pieceTypeId)) {
        sendUserFeedback(socketId, 'selected piece was not a land type.');
        return;
    }

    // within range
    const distance = distanceMatrix[destroyerPiece.piecePositionId][targetPiece.piecePositionId];
    if (!DESTROYER_ATTACK_RANGE_CHANCE[distance]) {
        sendUserFeedback(socketId, 'selected target was out of range');
        return;
    }

    // insert the 'plan' for bio weapon into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.insertBombardmentAttack(gameId, destroyerPiece, targetPiece))) {
        sendUserFeedback(socketId, 'db failed to insert bombardment attack, likely already an entry for that position.');
        return;
    }

    const serverAction: BombardmentAction = {
        type: BOMBARDMENT_SELECTED,
        payload: {
            selectedPiece: destroyerPiece,
            selectedTargetPiece: targetPiece
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
