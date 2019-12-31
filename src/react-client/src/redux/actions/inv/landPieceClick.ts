import { Dispatch } from 'redux';
import { PLACE_PHASE_ID, SERVER_PIECE_PLACE, SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { EmitType, FullState, InvItemPlaceRequestAction, InvItemType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to select inv item to place on the board (land item)
 */
export const landPieceClick = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
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
