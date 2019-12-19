import { Dispatch } from "redux";
import { EmitType } from "../../constants/interfaces";
import { NEWSPOPUP_MINIMIZE_TOGGLE } from "./actionTypes";

/**
 * Dispatch to state that user toggled minimize for news popup.
 */
const newsPopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch({
            type: NEWSPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default newsPopupMinimizeToggle;
