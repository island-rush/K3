import { DispatchType, EmitType } from "../../../constants/interfaces";
import { REFUELPOPUP_MINIMIZE_TOGGLE } from "../actionTypes";

/**
 * Action to toggle refuel popup minimized.
 */
const refuelPopupMinimizeToggle = () => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        dispatch({
            type: REFUELPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default refuelPopupMinimizeToggle;
