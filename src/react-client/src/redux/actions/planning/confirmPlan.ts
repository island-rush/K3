import { Dispatch } from "redux";
import { EmitType, ReduxAction } from "../../../constants/interfaces";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../../constants/otherConstants";
import { SERVER_CONFIRM_PLAN } from "../actionTypes";
import setUserfeedbackAction from "../setUserfeedbackAction";

/**
 * Action to confirm a list of moves as a plan for a piece.
 */
const confirmPlan = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (gameboardMeta.planning.moves.length === 0) {
            dispatch(setUserfeedbackAction("Can't submit an empty plan..."));
        } else {
            const clientAction: ReduxAction = {
                type: SERVER_CONFIRM_PLAN,
                payload: {
                    pieceId: gameboardMeta.selectedPiece.pieceId,
                    plan: gameboardMeta.planning.moves
                }
            };

            emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
        }
    };
};

export default confirmPlan;
