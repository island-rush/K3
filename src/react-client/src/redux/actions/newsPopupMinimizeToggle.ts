import { DispatchType, EmitType } from "../../constants/interfaces";
import { NEWSPOPUP_MINIMIZE_TOGGLE } from "./actionTypes";

/**
 * Dispatch to state that user toggled minimize for news popup.
 */
const newsPopupMinimizeToggle = () => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        dispatch({
            type: NEWSPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default newsPopupMinimizeToggle;
