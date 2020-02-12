// prettier-ignore
import { COMBAT_PHASE_ID, DELETE_PLAN, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, SLICE_PLANNING_ID, NOT_WAITING_STATUS } from '../../../constants';
import { DeletePlanAction, DeletePlanRequestAction, SocketSession } from '../../../types';
import { Game, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * Client request to delete a plan for a piece.
 */
export const deletePlan = async (session: SocketSession, action: DeletePlanRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam } = ir3;

    const { pieceId } = action.payload;

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

    // Can only change/delete plans in combat phase (2) and slice 0
    if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right phase/slice...looking for phase 2 slice 0');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    // Does the piece exist? (And match for this game/team/controller)
    const thisPiece = await new Piece(pieceId).init();
    if (!thisPiece) {
        sendUserFeedback(socketId, 'Piece did not exists...refresh page?');
        return;
    }

    const { pieceGameId, pieceTeamId } = thisPiece;

    if (pieceGameId !== gameId || pieceTeamId !== gameTeam) {
        sendUserFeedback(socketId, 'Piece did not belong to your team...(or this game)');
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
    sendToTeam(gameId, gameTeam, serverAction);
};
