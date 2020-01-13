// prettier-ignore
import { ALL_GROUND_TYPES, COMBAT_PHASE_ID, CONTAINER_TYPES, distanceMatrix, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, initialGameboardEmpty, INNER_PIECE_CLICK_ACTION, SLICE_PLANNING_ID, TYPE_MAIN } from '../../../constants';
import { ExitContainerAction, ExitTransportContainerRequestAction, SocketSession } from '../../../types';
import { Game, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to move piece outside of a transport container to an adjacent land piece
 */
export const exitTransportContainer = async (session: SocketSession, action: ExitTransportContainerRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    const { selectedPiece, containerPiece, selectedPositionId } = action.payload;

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

    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socketId, 'Not the right controller type for this action...');
        return;
    }

    if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right phase/slice for container entering.');
        return;
    }

    // Grab the Pieces
    const thisSelectedPiece = await new Piece(selectedPiece.pieceId).init();
    if (!thisSelectedPiece) {
        sendUserFeedback(socketId, 'Selected Piece did not exists...refresh page probably');
        return;
    }

    const thisContainerPiece = await new Piece(containerPiece.pieceId).init();
    if (!thisContainerPiece) {
        sendUserFeedback(socketId, 'Selected Container piece did not exist...');
        return;
    }

    if (!CONTAINER_TYPES.includes(thisContainerPiece.pieceTypeId)) {
        sendUserFeedback(socketId, 'Selected Container piece was not a container type');
        return;
    }

    if (thisSelectedPiece.pieceContainerId !== thisContainerPiece.pieceId) {
        sendUserFeedback(socketId, "Tried to move piece outside container, it wasn't in the container to begin with...");
        return;
    }

    if (!ALL_GROUND_TYPES.includes(initialGameboardEmpty[selectedPositionId].type)) {
        sendUserFeedback(socketId, 'Tried to move piece to non-land position.');
        return;
    }

    if (distanceMatrix[thisContainerPiece.piecePositionId][selectedPositionId] !== 1) {
        sendUserFeedback(socketId, 'Tried to move piece to position that was not exactly 1 hex away.');
        return;
    }

    await Piece.putOutsideContainer(thisSelectedPiece.pieceId, selectedPositionId);

    const serverAction: ExitContainerAction = {
        type: INNER_PIECE_CLICK_ACTION,
        payload: {
            gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
            selectedPiece,
            containerPiece
        }
    };

    sendToTeam(gameId, gameTeam, serverAction);
};
