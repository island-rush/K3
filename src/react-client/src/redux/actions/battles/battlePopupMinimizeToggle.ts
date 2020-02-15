import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { BattlePopupToggleAction, BATTLEPOPUP_MINIMIZE_TOGGLE } from '../../../../../types';

export const battlePopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const battlePopupToggleAction: BattlePopupToggleAction = {
            type: BATTLEPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(battlePopupToggleAction);
        return;
    };
};
