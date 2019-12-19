import { Dispatch } from "redux";
import { EmitType, PieceType } from "../../constants/interfaces";
import { PIECE_CLICK } from "./actionTypes";

/**
 * Change the state based on the piece that the user selected.
 */
const selectPiece = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (!gameboardMeta.planning.active) {
            dispatch({
                type: PIECE_CLICK,
                payload: {
                    selectedPiece
                }
            });
        }
    };
};

export default selectPiece;
