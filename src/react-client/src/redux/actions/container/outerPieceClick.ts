import { Dispatch } from 'redux';
import { SERVER_OUTER_PIECE_CLICK, SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { EmitType, EnterContainerRequestAction, FullState, PieceType } from '../../../../../types';

/**
 * Action to move outside piece to the inside of a container.
 */
export const outerPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        //TODO: figure out if this is allowed (like all other actions)

        const clientAction: EnterContainerRequestAction = {
            type: SERVER_OUTER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};
