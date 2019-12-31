import { Dispatch } from 'redux';
import { PIECE_CLOSE_ACTION } from '../../../../../constants';
import { EmitType, FullState, PieceCloseAction, PieceType } from '../../../../../types';

/**
 * Action to close the container popup.
 */
export const pieceClose = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
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
