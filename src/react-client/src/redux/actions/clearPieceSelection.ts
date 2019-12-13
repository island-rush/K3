//TODO: get rid of this function and use pieceClick(-1) or something that could handle it that way

import { PIECE_CLEAR_SELECTION } from "./actionTypes";

const clearPieceSelection = () => {
    return (dispatch: any, getState: any, emit: any) => {
        const { gameboardMeta } = getState();

        if (!gameboardMeta.planning.active) {
            dispatch({
                type: PIECE_CLEAR_SELECTION
            });
        }
    };
};

export default clearPieceSelection;
