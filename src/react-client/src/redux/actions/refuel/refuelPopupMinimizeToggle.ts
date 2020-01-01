import { Dispatch } from 'redux';
import { REFUELPOPUP_MINIMIZE_TOGGLE } from '../../../../../constants';
import { EmitType, RefuelPopupToggleAction } from '../../../../../types';
import { FullState } from '../../reducers';

/**
 * Action to toggle refuel popup minimized.
 */
export const refuelPopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const refuelPopupMinimizeAction: RefuelPopupToggleAction = {
            type: REFUELPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(refuelPopupMinimizeAction);
    };
};
