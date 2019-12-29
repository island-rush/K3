import { Dispatch } from 'redux';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from '../../../../../constants';
import { EmitType, RaiseMoraleSelectingAction } from '../../../../../types';
import { RAISE_MORALE_SELECTING } from '../../../../../constants';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../../../types';

//TODO: need to get rid of boost = x from the component when the raise morale is expired

export const raiseMorale = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
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
    };
};

export default raiseMorale;
