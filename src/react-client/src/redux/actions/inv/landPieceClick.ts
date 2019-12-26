import { Dispatch } from 'redux';
import { PLACE_PHASE_ID } from '../../../../../constants';
import { EmitType, InvItemPlaceRequestAction } from '../../../interfaces/interfaces';
// TODO: this is only imported to the frontend, export it from frontend file like websocket thing
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { SERVER_PIECE_PLACE } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../../../types';

/**
 * Action to select inv item to place on the board (land item)
 */
export const landPieceClick = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta, gameInfo } = getState();

        const { gamePhase } = gameInfo;

        if (gamePhase !== PLACE_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase to place land inv item.'));
            return;
        }

        const { selectedPosition } = gameboardMeta;

        if (selectedPosition === -1) {
            dispatch(setUserfeedbackAction('Must select a position before using an inv item...'));
            return;
        }

        //TODO: Is this position a land position or island we own?
        //other game effects that might prevent placing it...

        const { invItemId } = invItem; //TODO: send the whole item anyway? (even though the server only uses the id, consistent...)

        const clientAction: InvItemPlaceRequestAction = {
            type: SERVER_PIECE_PLACE,
            payload: {
                invItemId,
                selectedPosition
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default landPieceClick;
