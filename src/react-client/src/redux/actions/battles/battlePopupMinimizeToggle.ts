import { Dispatch } from 'redux';
import { BATTLEPOPUP_MINIMIZE_TOGGLE } from '../../../../../constants';
import { BattlePopupToggleAction, EmitType, FullState } from '../../../../../types';

export const battlePopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const battlePopupToggleAction: BattlePopupToggleAction = {
            type: BATTLEPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(battlePopupToggleAction);
    };
};

export default battlePopupMinimizeToggle;
