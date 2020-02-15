import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { PIECE_PLACE_START, PLACE_PHASE_ID } from '../../../../../constants';
import { InvItemType, PiecePlaceStartAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to put inv item on the board.
 */
export const invPieceClick = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

        const { gamePhase } = gameInfo;

        if (gamePhase !== PLACE_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase to place inv item.'));
            return;
        }

        // const { selectedPosition } = gameboardMeta;

        // if (selectedPosition === NO_POSITION) {
        //     dispatch(setUserfeedbackAction('Must select a position before using an inv item...'));
        //     return;
        // }

        // TODO: Client side checks

        // const { invItemId } = invItem; // TODO: send the whole item anyway to be consistent...

        // const clientAction: InvItemPlaceRequestAction = {
        //     type: SERVER_PIECE_PLACE,
        //     payload: {
        //         invItemId,
        //         selectedPosition
        //     }
        // };

        // sendToServer(clientAction);

        const clientAction: PiecePlaceStartAction = {
            type: PIECE_PLACE_START,
            payload: {
                invItem
            }
        };

        dispatch(clientAction);

        return;
    };
};
