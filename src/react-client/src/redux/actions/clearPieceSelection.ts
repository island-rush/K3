//TODO: get rid of this function and use pieceClick(-1) or something that could handle it that way

import { Dispatch } from 'redux';
import { PIECE_CLEAR_SELECTION } from '../../../../constants';
import { EmitType, FullState, PieceClearAction } from '../../../../types';

/**
 * Action to de-select all pieces in the zoombox
 */
export const clearPieceSelection = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { planning } = getState();

        if (!planning.active) {
            const pieceClearAction: PieceClearAction = {
                type: PIECE_CLEAR_SELECTION,
                payload: {}
            };

            dispatch(pieceClearAction);
        }
    };
};
