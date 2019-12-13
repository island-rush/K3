import { REFUELPOPUP_MINIMIZE_TOGGLE } from "../actionTypes";

const refuelPopupMinimizeToggle = () => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch({
            type: REFUELPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default refuelPopupMinimizeToggle;
