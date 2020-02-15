// prettier-ignore
import { COMBAT_PHASE_ID, C_130_TYPE_ID, DRONE_SWARMS_TYPE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, SLICE_PLANNING_ID, TYPE_SPECIAL } from '../../../constants';
import { DroneSwarmAction, DroneSwarmRequestAction, DRONE_SWARM_SELECTED, SocketSession } from '../../../types';
import { Capability, Game, InvItem, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to use DroneSwarm capability.
 */
export const droneSwarmConfirm = async (session: SocketSession, action: DroneSwarmRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    // TODO: this catches errors at runtime? but already checked during compile time with typescript / maybe consider getting rid of it or standardizing all functions to use it
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

    // gamePhase 2 is only phase for drone swarm
    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // gameSlice 0 is only slice for drone swarm
    if (gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right slice (must be planning)...');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    // Only the special controller (since they have control over c130?)
    if (!gameControllers.includes(TYPE_SPECIAL)) {
        sendUserFeedback(socketId, 'Not the special controller (4)...');
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
        sendUserFeedback(socketId, 'Selected piece (c130) did not exist.');
        return;
    }

    // TODO: ideally would also check that the gameIds match, but how would they know about the piece? (possibly update all other requests to check this...)
    if (thisSelectedPiece.pieceTeamId !== gameTeam) {
        sendUserFeedback(socketId, 'Selected piece did not belong to your team.');
        return;
    }

    // verify correct type of inv item
    const { invItemTypeId } = thisInvItem;
    if (invItemTypeId !== DRONE_SWARMS_TYPE_ID) {
        sendUserFeedback(socketId, 'Inv Item was not a drone swarm type.');
        return;
    }

    // verify correct type of selected piece
    const { pieceTypeId, piecePositionId } = thisSelectedPiece;
    if (pieceTypeId !== C_130_TYPE_ID) {
        sendUserFeedback(socketId, 'selected piece was not a c130.');
        return;
    }

    // insert the 'plan' for bio weapon into the db for later use
    // let the client(team) know that this plan was accepted
    if (!(await Capability.insertDroneSwarm(gameId, gameTeam, piecePositionId))) {
        sendUserFeedback(socketId, 'db failed to insert drone swarm, likely already an entry for that position.');
        return;
    }

    await thisInvItem.delete();

    const serverAction: DroneSwarmAction = {
        type: DRONE_SWARM_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPositionId: piecePositionId
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
