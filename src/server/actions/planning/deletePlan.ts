import { Socket } from 'socket.io';
// prettier-ignore
import { COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, SLICE_PLANNING_ID, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../../../constants';
import { DELETE_PLAN } from '../../../react-client/src/redux/actions/actionTypes';
import { DeletePlanAction, DeletePlanRequestAction, GameSession } from '../../../types';
import { Game, Piece } from '../../classes';
import { sendUserFeedback } from '../sendUserFeedback';

/**
 * Client request to delete a plan for a piece.
 */
export const deletePlan = async (socket: Socket, action: DeletePlanRequestAction) => {
    // Grab the Session
    const { gameId, gameTeam }: GameSession = socket.handshake.session.ir3;

    const { pieceId } = action.payload;

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

    // Can only change/delete plans in combat phase (2) and slice 0
    if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socket, 'Not the right phase/slice...looking for phase 2 slice 0');
        return;
    }

    // Does the piece exist? (And match for this game/team/controller)
    const thisPiece = await new Piece(pieceId).init();
    if (!thisPiece) {
        sendUserFeedback(socket, 'Piece did not exists...refresh page?');
        return;
    }

    const { pieceGameId, pieceTeamId } = thisPiece;

    if (pieceGameId !== gameId || pieceTeamId !== gameTeam) {
        sendUserFeedback(socket, 'Piece did not belong to your team...(or this game)');
        return;
    }

    await thisPiece.deletePlans();

    const serverAction: DeletePlanAction = {
        type: DELETE_PLAN,
        payload: {
            pieceId
        }
    };

    // Send the update to the client(s)
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction); // TODO: should the other sockets for this team get the update? (in the background?)
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default deletePlan;
