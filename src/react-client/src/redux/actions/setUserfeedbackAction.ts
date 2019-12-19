import { AnyAction } from "redux";
import { SET_USERFEEDBACK } from "./actionTypes";

/**
 * Helper function to create Redux Action to send userfeedback to the state.
 */
const setUserfeedbackAction = (userFeedback: string) => {
    const userFeedbackAction: AnyAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };
    return userFeedbackAction;
};

export default setUserfeedbackAction;
