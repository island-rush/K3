import { Dispatch } from 'redux';
import { PLACE_PHASE_ID } from '../../../constants/gameConstants';
import { EmitType, InvItemPlaceRequestAction, InvItemType } from '../../../constants/interfaces';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../constants/otherConstants';
import { SERVER_PIECE_PLACE } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';

/**
 * Action to put air piece inv item on the board.
 */
const airPieceClick = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta, gameInfo } = getState();

        const { gamePhase } = gameInfo;

        if (gamePhase !== PLACE_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase to place air inv item.'));
            return;
        }

        const { selectedPosition } = gameboardMeta;

        if (selectedPosition === -1) {
            dispatch(setUserfeedbackAction('Must select a position before using an inv item...'));
            return;
        }

        //TODO: Is this position an airfield or aircraft carrier?
        //Do we own the airfield? (does it need to be main island?) (any game effects preventing it?)
        //Do other checks for rules on placing planes...

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

export default airPieceClick;
