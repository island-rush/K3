import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { PIECE_CLICK } from '../../../../constants';
import { PieceClickAction, PieceType } from '../../../../types';

/**
 * Change the state based on the piece that the user selected.
 */
export const selectPiece = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { planning } = getState();

        if (!planning.active) {
            const clientAction: PieceClickAction = {
                type: PIECE_CLICK,
                payload: {
                    selectedPiece
                }
            };

            dispatch(clientAction);
        }
    };
};
