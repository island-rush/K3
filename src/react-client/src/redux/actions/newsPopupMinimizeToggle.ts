import { NEWSPOPUP_MINIMIZE_TOGGLE } from "./actionTypes";

const newsPopupMinimizeToggle = () => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch({
            type: NEWSPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        });
    };
};

export default newsPopupMinimizeToggle;
