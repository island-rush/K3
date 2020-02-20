// TODO: get rid of this function and use pieceClick(-1) or something that could handle it that way

import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { PieceClearAction, PIECE_CLEAR_SELECTION } from '../../../../types';

/**
 * Action to de-select all pieces in the zoombox
 */
export const clearPieceSelection = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { planning } = getState();

        if (!planning.isActive) {
            const pieceClearAction: PieceClearAction = {
                type: PIECE_CLEAR_SELECTION,
                payload: {}
            };

            dispatch(pieceClearAction);
        }
    };
};
