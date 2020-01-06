import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { SERVER_INNER_PIECE_CLICK } from '../../../../../constants';
import { ExitContainerRequestAction, PieceType } from '../../../../../types';

/**
 * Move piece from inside container to outside (same position)
 */
export const innerPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        //TODO: figure out if inner piece click is allowed

        const clientAction: ExitContainerRequestAction = {
            type: SERVER_INNER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        sendToServer(clientAction);
    };
};
