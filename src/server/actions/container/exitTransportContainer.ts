import { Socket } from 'socket.io';
// prettier-ignore
import { ALL_GROUND_TYPES, COMBAT_PHASE_ID, CONTAINER_TYPES, distanceMatrix, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, initialGameboardEmpty, INNER_PIECE_CLICK_ACTION, SLICE_PLANNING_ID, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION, TYPE_MAIN } from '../../../constants';
import { ExitContainerAction, ExitTransportContainerRequestAction, GameSession } from '../../../types';
import { Game, Piece } from '../../classes';
import { sendUserFeedback } from '../sendUserFeedback';

/**
 * User request to move piece outside of a transport container to an adjacent land piece
 */
export const exitTransportContainer = async (socket: Socket, action: ExitTransportContainerRequestAction) => {
    // Grab the Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    const { selectedPiece, containerPiece, selectedPositionId } = action.payload;

    // Grab the Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, 'Not the right controller type for this action...');
        return;
    }

    if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socket, 'Not the right phase/slice for container entering.');
        return;
    }

    // Grab the Pieces
    const thisSelectedPiece = await new Piece(selectedPiece.pieceId).init();
    if (!thisSelectedPiece) {
        sendUserFeedback(socket, 'Selected Piece did not exists...refresh page probably');
        return;
    }

    const thisContainerPiece = await new Piece(containerPiece.pieceId).init();
    if (!thisContainerPiece) {
        sendUserFeedback(socket, 'Selected Container piece did not exist...');
        return;
    }

    if (!CONTAINER_TYPES.includes(thisContainerPiece.pieceTypeId)) {
        sendUserFeedback(socket, 'Selected Container piece was not a container type');
        return;
    }

    if (thisSelectedPiece.pieceContainerId !== thisContainerPiece.pieceId) {
        sendUserFeedback(socket, "Tried to move piece outside container, it wasn't in the container to begin with...");
        return;
    }

    if (!ALL_GROUND_TYPES.includes(initialGameboardEmpty[selectedPositionId].type)) {
        sendUserFeedback(socket, 'Tried to move piece to non-land position.');
        return;
    }

    if (distanceMatrix[thisContainerPiece.piecePositionId][selectedPositionId] !== 1) {
        sendUserFeedback(socket, 'Tried to move piece to position that was not exactly 1 hex away.');
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

    // TODO: could make some sort of helper to send to teams and stuff, this is a little weird...
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default exitTransportContainer;
