import { BATTLEPOPUP_MINIMIZE_TOGGLE } from "../actionTypes";

const battlePopupMinimizeToggle = () => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch({
            type: BATTLEPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default battlePopupMinimizeToggle;
