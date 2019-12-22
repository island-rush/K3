//TODO: get rid of this function and use pieceClick(-1) or something that could handle it that way

import { Dispatch } from 'redux';
import { EmitType, PieceClearAction } from '../../constants/interfaces';
import { PIECE_CLEAR_SELECTION } from './actionTypes';

/**
 * Action to de-select all pieces in the zoombox
 */
const clearPieceSelection = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (!gameboardMeta.planning.active) {
            const pieceClearAction: PieceClearAction = {
                type: PIECE_CLEAR_SELECTION,
                payload: {}
            };

            dispatch(pieceClearAction);
        }
    };
};

export default clearPieceSelection;
