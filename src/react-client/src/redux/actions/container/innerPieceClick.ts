import { Dispatch } from "redux";
import { EmitType, PieceType, ReduxAction } from "../../../constants/interfaces";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../../constants/otherConstants";
import { SERVER_INNER_PIECE_CLICK } from "../actionTypes";

/**
 * Move piece from inside container to outside (same position)
 */
const innerPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //TODO: figure out if inner piece click is allowed

        const clientAction: ReduxAction = {
            type: SERVER_INNER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);

        // dispatch({
        //     type: INNER_PIECE_CLICK_ACTION,
        //     payload: {
        //         selectedPiece
        //     }
        // });
    };
};

export default innerPieceClick;
