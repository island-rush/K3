import { UserfeedbackAction } from '../../constants/interfaces';
import { SET_USERFEEDBACK } from './actionTypes';

/**
 * Helper function to create Redux Action to send userfeedback to the state.
 */
const setUserfeedbackAction = (userFeedback: string) => {
    const userFeedbackAction: UserfeedbackAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };
    return userFeedbackAction;
};

export default setUserfeedbackAction;
