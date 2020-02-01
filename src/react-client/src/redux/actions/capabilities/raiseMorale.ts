import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, RAISE_MORALE_SELECTING, SLICE_PLANNING_ID } from '../../../../../constants';
import { InvItemType, RaiseMoraleSelectingAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

// TODO: need to get rid of boost = x from the component when the raise morale is expired

export const raiseMorale = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            // TODO: a lot of these were copy paste, should go through all userfeedbacks and make sure they make sense (and are professional?) and better formatted
            dispatch(setUserfeedbackAction('wrong phase for raise morale dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use raise morale.'));
            return;
        }

        //other checks that the player is allowed to select raise morale (do they have it? / game effects...)

        //dispatch that the player is currently selecting which commander type to boost
        const raiseMoraleSelectingAction: RaiseMoraleSelectingAction = {
            type: RAISE_MORALE_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(raiseMoraleSelectingAction);
        return;
    };
};
