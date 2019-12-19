import { Socket } from "socket.io";
import { AnyAction } from "redux";
import { COMBAT_PHASE_ID, INSURGENCY_TYPE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from "../../../react-client/src/constants/gameConstants";
import { GameSession, InvItemType } from "../../../react-client/src/constants/interfaces";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../react-client/src/constants/otherConstants";
import { INSURGENCY_SELECTED } from "../../../react-client/src/redux/actions/actionTypes";
import { Capability, Game, InvItem } from "../../classes";
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import sendUserFeedback from "../sendUserFeedback";

/**
 * User Request to use Insurgency Capability
 */
const insurgencyConfirm = async (socket: Socket, payload: InsurgencyConfirmPayload) => {
    //Grab the Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    if (payload == null || payload.selectedPositionId == null) {
        sendUserFeedback(socket, "Server Error: Malformed Payload (missing selectedPositionId)");
        return;
    }

    const { selectedPositionId, invItem } = payload;

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

    //gamePhase 2 is only phase for insurgency
    if (gamePhase != COMBAT_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    //gameSlice 0 is only slice for insurgency
    if (gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right slice (must be planning)...");
        return;
    }

    //Only the main controller (0) can use insurgency
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
    if (invItemTypeId != INSURGENCY_TYPE_ID) {
        sendUserFeedback(socket, "Inv Item was not a insurgency type.");
        return;
    }

    //does the position make sense?
    if (selectedPositionId < 0) {
        sendUserFeedback(socket, "got a negative position for insurgency.");
        return;
    }

    //insert the 'plan' for insurgency into the db for later use
    //let the client(team) know that this plan was accepted
    if (!(await Capability.insurgencyInsert(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socket, "db failed to insert insurgency, likely already an entry for that position.");
        return;
    }

    await thisInvItem.delete();

    const serverAction: AnyAction = {
        type: INSURGENCY_SELECTED,
        payload: {
            invItem: thisInvItem,
            selectedPositionId
        }
    };

    //Send the update to the client(s)
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.to("game" + gameId + "team" + gameTeam).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

type InsurgencyConfirmPayload = {
    selectedPositionId: number;
    invItem: InvItemType;
};

export default insurgencyConfirm;
