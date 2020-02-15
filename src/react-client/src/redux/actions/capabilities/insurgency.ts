import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { InsurgencySelectingAction, INSURGENCY_SELECTING, InvItemType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const insurgency = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for insurgency dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use insurgency.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already clicked to continue'));
            return;
        }

        if (!gameControllers.includes(TYPE_MAIN)) {
            dispatch(setUserfeedbackAction('must be main controller to use'));
            return;
        }

        //other checks that the player is allowed to select insurgency (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        const insurgencySelectingAction: InsurgencySelectingAction = {
            type: INSURGENCY_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(insurgencySelectingAction);
        return;
    };
};
