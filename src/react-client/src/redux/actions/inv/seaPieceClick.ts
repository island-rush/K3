import { Dispatch } from "redux";
import { PLACE_PHASE_ID } from "../../../constants/gameConstants";
import { EmitType, InvItemType, ReduxAction } from "../../../constants/interfaces";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../../constants/otherConstants";
import { SERVER_PIECE_PLACE } from "../actionTypes";
import setUserfeedbackAction from "../setUserfeedbackAction";

/**
 * Click an inv item to put into a sea position.
 */
const seaPieceClick = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta, gameInfo } = getState();

        const { gamePhase } = gameInfo;

        if (gamePhase !== PLACE_PHASE_ID) {
            dispatch(setUserfeedbackAction("wrong phase to place sea inv item."));
            return;
        }

        const { selectedPosition } = gameboardMeta;

        if (selectedPosition === -1) {
            dispatch(setUserfeedbackAction("Must select a position before using an inv item..."));
            return;
        }

        //TODO: Is this position a sea position or around the island we own?
        //other game effects that might prevent placing it...

        const { invItemId } = invItem; //TODO: send the whole item anyway? (even though the server only uses the id, consistent...)

        const clientAction: ReduxAction = {
            type: SERVER_PIECE_PLACE,
            payload: {
                invItemId,
                selectedPosition
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default seaPieceClick;
