import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from '../../../../../constants';
import { InvItemType, MissileDisruptSelectingAction, MISSILE_DISRUPT_SELECTING } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const missileLaunchDisruption = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for launch disruption dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use launch disruption.'));
            return;
        }

        //dispatch that the player is currently selecting which position to select
        const missileDisruptSelectingAction: MissileDisruptSelectingAction = {
            type: MISSILE_DISRUPT_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(missileDisruptSelectingAction);
        return;
    };
};
