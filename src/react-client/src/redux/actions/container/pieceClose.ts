import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { PIECE_CLOSE_ACTION } from '../../../../../constants';
import { PieceCloseAction, PieceType } from '../../../../../types';

/**
 * Action to close the container popup.
 */
export const pieceClose = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        // const { gameboardMeta } = getState();

        // probably want ability to close that popup/menu at any point (even if open maliciously)
        const clientAction: PieceCloseAction = {
            type: PIECE_CLOSE_ACTION,
            payload: {
                selectedPiece
            }
        };

        dispatch(clientAction);
        return;
    };
};
