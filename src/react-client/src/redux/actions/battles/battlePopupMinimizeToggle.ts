import { Dispatch } from 'redux';
import { BattlePopupToggleAction, EmitType } from '../../../constants/interfaces';
import { BATTLEPOPUP_MINIMIZE_TOGGLE } from '../actionTypes';

const battlePopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const battlePopupToggleAction: BattlePopupToggleAction = {
            type: BATTLEPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(battlePopupToggleAction);
    };
};

export default battlePopupMinimizeToggle;
