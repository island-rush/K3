// prettier-ignore
import { COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, MISSILE_SELECTED, MISSILE_TYPE_ID, SLICE_PLANNING_ID, TYPE_OWNERS, TYPE_SEA, TYPE_SPECIAL } from '../../../constants';
import { MissileAction, MissileRequestAction, SocketSession } from '../../../types';
import { Capability, Game, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use missile (in silo)
 */
export const missileAttackConfirm = async (session: SocketSession, action: MissileRequestAction) => {
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

    // gamePhase 2 is only phase for missile attack
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for missile attack
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // Only the SOF controller
    if (!gameControllers.includes(TYPE_SPECIAL)) {
        sendUserFeedback(socketId, 'Not the sof controller (3)...');
        return;
    }

    // Does the invItem exist for it?
    const missilePiece = await new Piece(selectedPiece.pieceId).init();
    if (!missilePiece) {
        sendUserFeedback(socketId, 'Did not have the missile piece to complete this request.');
        return;
    }

    const targetPiece = await new Piece(selectedTargetPiece.pieceId).init();
    if (!targetPiece) {
        sendUserFeedback(socketId, 'Target piece did not exist.');
        return;
    }

    // TODO: tons more of checks that could happen here to verify that piece's belong to correct teams and things make sense for this action
    if (missilePiece.pieceTeamId !== gameTeam) {
        sendUserFeedback(socketId, 'Selected piece did not belong to your team.');
        return;
    }

    // verify correct type of missile
    if (missilePiece.pieceTypeId !== MISSILE_TYPE_ID) {
        sendUserFeedback(socketId, 'selected piece was not a missile type.');
        return;
    }

    // verify correct type of target
    // TODO: what are the ranges / capabilities of what targets are available (does distance factor into % hit?)
    if (TYPE_OWNERS[TYPE_SEA].includes(targetPiece.pieceTypeId)) {
        sendUserFeedback(socketId, 'selected piece was not a sea type.');
        return;
    }

    // insert the 'plan' for bio weapon into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.insertMissileAttack(gameId, missilePiece, targetPiece))) {
        sendUserFeedback(socketId, 'db failed to insert missile attack, likely already an entry for that position.');
        return;
    }

    const serverAction: MissileAction = {
        type: MISSILE_SELECTED,
        payload: {
            selectedPiece: missilePiece,
            selectedTargetPiece: targetPiece
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
