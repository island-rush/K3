import { Dispatch } from "redux";
import { EmitType, PieceType } from "../../../constants/interfaces";
import { INNER_TRANSPORT_PIECE_CLICK_ACTION } from "../actionTypes";

/**
 * Move a piece from inside a transport to outside (adjacent land)
 */
const innerTransportPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //TODO: figure out if inner piece click is allowed
        //TODO: could probably see if there is even land next to where this piece is (don't allow if in the open ocean?)

        dispatch({
            type: INNER_TRANSPORT_PIECE_CLICK_ACTION,
            payload: {
                selectedPiece,
                containerPiece
            }
        });
    };
};

export default innerTransportPieceClick;
