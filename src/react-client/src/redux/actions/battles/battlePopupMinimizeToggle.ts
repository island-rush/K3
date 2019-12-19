import { Dispatch } from "redux";
import { EmitType } from "../../../constants/interfaces";
import { BATTLEPOPUP_MINIMIZE_TOGGLE } from "../actionTypes";

const battlePopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch({
            type: BATTLEPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default battlePopupMinimizeToggle;
