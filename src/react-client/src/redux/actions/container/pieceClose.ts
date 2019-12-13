import { PIECE_CLOSE_ACTION } from "../actionTypes";

const pieceClose = (selectedPiece: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        // const { gameboardMeta } = getState();

        //probably want ability to close that popup/menu at any point (even if open maliciously)
        dispatch({
            type: PIECE_CLOSE_ACTION,
            payload: {
                selectedPiece
            }
        });
    };
};

export default pieceClose;
