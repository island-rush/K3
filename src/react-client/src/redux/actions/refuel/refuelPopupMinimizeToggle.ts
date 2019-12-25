import { Dispatch } from 'redux';
import { EmitType, RefuelPopupToggleAction } from '../../../interfaces/interfaces';
import { REFUELPOPUP_MINIMIZE_TOGGLE } from '../actionTypes';

/**
 * Action to toggle refuel popup minimized.
 */
export const refuelPopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const refuelPopupMinimizeAction: RefuelPopupToggleAction = {
            type: REFUELPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(refuelPopupMinimizeAction);
    };
};

export default refuelPopupMinimizeToggle;
