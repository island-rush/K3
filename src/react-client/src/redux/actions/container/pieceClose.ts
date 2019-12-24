import { Dispatch } from 'redux';
import { EmitType, PieceCloseAction } from '../../../interfaces/interfaces';
import { PIECE_CLOSE_ACTION } from '../actionTypes';
import { PieceType } from '../../../interfaces/classTypes';

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
