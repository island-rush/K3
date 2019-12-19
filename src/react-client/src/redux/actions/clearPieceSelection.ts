//TODO: get rid of this function and use pieceClick(-1) or something that could handle it that way

import { DispatchType, EmitType } from "../../constants/interfaces";
import { PIECE_CLEAR_SELECTION } from "./actionTypes";

/**
 * Action to de-select all pieces in the zoombox
 */
const clearPieceSelection = () => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (!gameboardMeta.planning.active) {
            dispatch({
                type: PIECE_CLEAR_SELECTION,
                payload: {}
            });
        }
    };
};

export default clearPieceSelection;
