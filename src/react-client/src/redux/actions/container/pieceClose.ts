import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { PieceCloseAction, PieceType, PIECE_CLOSE_ACTION } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to close the container popup.
 */
export const pieceClose = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { planning } = getState();

        if (planning.isActive) {
            dispatch(setUserfeedbackAction('cant open while planning active'));
            return;
        }

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
