import { Dispatch } from "redux";
import { EmitType } from "../../../constants/interfaces";
import { REFUELPOPUP_MINIMIZE_TOGGLE } from "../actionTypes";

/**
 * Action to toggle refuel popup minimized.
 */
const refuelPopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch({
            type: REFUELPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default refuelPopupMinimizeToggle;
