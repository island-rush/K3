import { Dispatch } from 'redux';
import { EmitType, ExitContainerRequestAction, PieceType } from '../../../constants/interfaces';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../constants/otherConstants';
import { SERVER_INNER_PIECE_CLICK } from '../actionTypes';

/**
 * Move piece from inside container to outside (same position)
 */
const innerPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //TODO: figure out if inner piece click is allowed

        const clientAction: ExitContainerRequestAction = {
            type: SERVER_INNER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default innerPieceClick;
