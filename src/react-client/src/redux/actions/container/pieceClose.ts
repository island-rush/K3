import { Dispatch } from "redux";
import { EmitType, PieceCloseAction, PieceType } from "../../../constants/interfaces";
import { PIECE_CLOSE_ACTION } from "../actionTypes";

/**
 * Action to close the container popup.
 */
const pieceClose = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        // const { gameboardMeta } = getState();

        //probably want ability to close that popup/menu at any point (even if open maliciously)
        const clientAction: PieceCloseAction = {
            type: PIECE_CLOSE_ACTION,
            payload: {
                selectedPiece
            }
        };

        dispatch(clientAction);
    };
};

export default pieceClose;
