import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { REFUELPOPUP_MINIMIZE_TOGGLE } from '../../../../../constants';
import { RefuelPopupToggleAction } from '../../../../../types';

/**
 * Action to toggle refuel popup minimized.
 */
export const refuelPopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const refuelPopupMinimizeAction: RefuelPopupToggleAction = {
            type: REFUELPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(refuelPopupMinimizeAction);
        return;
    };
};
