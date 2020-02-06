import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { PLACE_PHASE_ID, SERVER_PIECE_PLACE, NO_POSITION } from '../../../../../constants';
import { InvItemPlaceRequestAction, InvItemType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to put inv item on the board.
 */
export const invPieceClick = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameboardMeta, gameInfo } = getState();

        const { gamePhase } = gameInfo;

        if (gamePhase !== PLACE_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase to place inv item.'));
            // return;
        }

        const { selectedPosition } = gameboardMeta;

        if (selectedPosition === NO_POSITION) {
            dispatch(setUserfeedbackAction('Must select a position before using an inv item...'));
            return;
        }

        // TODO: Client side checks

        const { invItemId } = invItem; // TODO: send the whole item anyway to be consistent...

        const clientAction: InvItemPlaceRequestAction = {
            type: SERVER_PIECE_PLACE,
            payload: {
                invItemId,
                selectedPosition
            }
        };

        sendToServer(clientAction);
        return;
    };
};
