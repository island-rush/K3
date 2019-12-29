import { Dispatch } from 'redux';
import { EmitType, PieceCloseAction } from '../../../../../types';
import { PIECE_CLOSE_ACTION } from '../../../../../constants';
import { PieceType } from '../../../../../types';

/**
 * Action to close the container popup.
 */
export const pieceClose = (selectedPiece: PieceType) => {
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
