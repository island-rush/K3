import { Socket } from "socket.io";
//prettier-ignore
import { ALL_COMMANDER_TYPES, COMBAT_PHASE_ID, RAISE_MORALE_TYPE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from "../../../react-client/src/constants/gameConstants";
import { GameSession, InvItemType, RaiseMoraleAction, RaiseMoraleRequestAction } from "../../../react-client/src/constants/interfaces";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../react-client/src/constants/otherConstants";
import { RAISE_MORALE_SELECTED } from "../../../react-client/src/redux/actions/actionTypes";
import { Capability, Game, InvItem, Piece } from "../../classes";
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import sendUserFeedback from "../sendUserFeedback";

/**
 * User request to use Raise Morale capability on a set of troops for a commander.
 */
const raiseMoraleConfirm = async (socket: Socket, action: RaiseMoraleRequestAction) => {
    //Grab Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    if (action.payload == null || action.payload.selectedCommanderType == null) {
        sendUserFeedback(socket, "Server Error: Malformed Payload (missing selectedCommanderType)");
        return;
    }

    const { selectedCommanderType, invItem } = action.payload;

    //Get the Game
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

    //gamePhase 2 is only phase for raise morale
    if (gamePhase != COMBAT_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    //gameSlice 0 is only slice for raise morale
    if (gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right slice (must be planning)...");
        return;
    }

    //Only the main controller (0) can use raise morale
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, "Not the main controller (0)...");
        return;
    }

    const { invItemId } = invItem;

    //Does the invItem exist for it?
    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socket, "Did not have the invItem to complete this request.");
        return;
    }

    //verify correct type of inv item
    const { invItemTypeId } = thisInvItem;
    if (invItemTypeId != RAISE_MORALE_TYPE_ID) {
        sendUserFeedback(socket, "Inv Item was not a raise morale type.");
        return;
    }

    //does the commander selection make sense?
    if (!ALL_COMMANDER_TYPES.includes(selectedCommanderType)) {
        sendUserFeedback(socket, "got a negative position for raise morale.");
        return;
    }

    //insert the raise morale into the db to start using it
    if (!(await Capability.insertRaiseMorale(gameId, gameTeam, selectedCommanderType))) {
        sendUserFeedback(socket, "db failed to insert raise morale, likely already an entry for that position.");
        return;
    }

    await thisInvItem.delete();

    const gameboardPieces = await Piece.getVisiblePieces(gameId, gameTeam);
    const confirmedRaiseMorale = await Capability.getRaiseMorale(gameId, gameTeam);

    // let the client(team) know that this plan was accepted
    const serverAction: RaiseMoraleAction = {
        type: RAISE_MORALE_SELECTED,
        payload: {
            invItem: thisInvItem,
            confirmedRaiseMorale,
            gameboardPieces
        }
    };

    //Send the update to the client(s)
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.to("game" + gameId + "team" + gameTeam).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default raiseMoraleConfirm;
