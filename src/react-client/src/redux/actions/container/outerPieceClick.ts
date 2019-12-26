import { Dispatch } from 'redux';
import { EmitType, EnterContainerRequestAction } from '../../../interfaces/interfaces';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { SERVER_OUTER_PIECE_CLICK } from '../actionTypes';
import { PieceType } from '../../../../../types';

/**
 * Action to move outside piece to the inside of a container.
 */
export const outerPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
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

export default outerPieceClick;
