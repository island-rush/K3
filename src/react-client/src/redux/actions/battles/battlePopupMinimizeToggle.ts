import { Dispatch } from 'redux';
import { BattlePopupToggleAction, EmitType } from '../../../../../types';
import { BATTLEPOPUP_MINIMIZE_TOGGLE } from '../actionTypes';

export const battlePopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const battlePopupToggleAction: BattlePopupToggleAction = {
            type: BATTLEPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(battlePopupToggleAction);
    };
};

export default battlePopupMinimizeToggle;
