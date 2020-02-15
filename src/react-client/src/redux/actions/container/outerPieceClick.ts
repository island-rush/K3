import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { EnterContainerRequestAction, PieceType, SERVER_OUTER_PIECE_CLICK } from '../../../../../types';

/**
 * Action to move outside piece to the inside of a container.
 */
export const outerPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        // TODO: figure out if this is allowed (like all other actions)

        const clientAction: EnterContainerRequestAction = {
            type: SERVER_OUTER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        sendToServer(clientAction);
        return;
    };
};
