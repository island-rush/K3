import { Dispatch } from 'redux';
import { EmitType, PieceClickAction } from '../../constants/interfaces';
import { PIECE_CLICK } from './actionTypes';
import { PieceType } from '../../interfaces/classTypes';

/**
 * Change the state based on the piece that the user selected.
 */
const selectPiece = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (!gameboardMeta.planning.active) {
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

export default selectPiece;
