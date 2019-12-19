import { DispatchType, EmitType } from "../../../constants/interfaces";
import { BATTLEPOPUP_MINIMIZE_TOGGLE } from "../actionTypes";

const battlePopupMinimizeToggle = () => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        dispatch({
            type: BATTLEPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default battlePopupMinimizeToggle;
