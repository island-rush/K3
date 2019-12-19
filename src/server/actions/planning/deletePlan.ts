import { Socket } from "socket.io";
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from "../../../react-client/src/constants/gameConstants";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../react-client/src/constants/otherConstants";
import { DELETE_PLAN } from "../../../react-client/src/redux/actions/actionTypes";
import { Game, Piece } from "../../classes";
import { GAME_INACTIVE_TAG, GAME_DOES_NOT_EXIST } from "../../pages/errorTypes";
import sendUserFeedback from "../sendUserFeedback";
import { GameSession, ReduxAction } from "../../../react-client/src/constants/interfaces";

/**
 * Client request to delete a plan for a piece.
 */
const deletePlan = async (socket: Socket, payload: DeletePlanPayload) => {
    //Grab the Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    const { pieceId } = payload;

    //Grab the Game
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

    //Can only change/delete plans in combat phase (2) and slice 0
    if (gamePhase != COMBAT_PHASE_ID || gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right phase/slice...looking for phase 2 slice 0");
        return;
    }

    //Does the piece exist? (And match for this game/team/controller)
    const thisPiece = await new Piece(pieceId).init();
    if (!thisPiece) {
        sendUserFeedback(socket, "Piece did not exists...refresh page?");
        return;
    }

    const { pieceGameId, pieceTeamId } = thisPiece;

    if (pieceGameId != gameId || pieceTeamId != gameTeam) {
        sendUserFeedback(socket, "Piece did not belong to your team...(or this game)");
        return;
    }

    await thisPiece.deletePlans();

    const serverAction: ReduxAction = {
        type: DELETE_PLAN,
        payload: {
            pieceId
        }
    };

    //Send the update to the client(s)
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction); //TODO: should the other sockets for this team get the update? (in the background?)
    socket.to("game" + gameId + "team" + gameTeam).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

type DeletePlanPayload = {
    pieceId: number;
};

export default deletePlan;
