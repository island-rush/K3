import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { PLACE_PHASE_ID, WAITING_STATUS, TYPE_OWNERS } from '../../../../../constants';
import { InvItemType, PiecePlaceStartAction, PIECE_PLACE_START } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to put inv item on the board.
 */
export const invPieceClick = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

        const { gamePhase, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== PLACE_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase to place inv item.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already done with placement phase.'));
            return;
        }

        let atLeast1Owner = false;
        for (const gameController of gameControllers) {
            if (TYPE_OWNERS[gameController].includes(invItem.invItemTypeId)) {
                atLeast1Owner = true;
                break;
            }
        }

        if (!atLeast1Owner) {
            dispatch(setUserfeedbackAction('you dont own that piece'));
            return;
        }

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
