import { PIECE_CLICK } from "./actionTypes";

const selectPiece = (selectedPiece: any) => {
    return (dispatch: any, getState: any, emit: any) => {
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
