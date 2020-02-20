import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { RefuelPopupToggleAction, REFUELPOPUP_MINIMIZE_TOGGLE } from '../../../../../types';

/**
 * Action to toggle refuel popup minimized.
 */
export const refuelPopupMinimizeToggle = () => {
    // TODO: rename to 'close' not minimize
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const refuelPopupMinimizeAction: RefuelPopupToggleAction = {
            type: REFUELPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(refuelPopupMinimizeAction);
        return;
    };
};
