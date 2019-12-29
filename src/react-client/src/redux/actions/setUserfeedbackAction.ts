import { SET_USERFEEDBACK } from '../../../../constants';
import { UserfeedbackAction } from '../../../../types';

/**
 * Helper function to create Redux Action to send userfeedback to the state.
 */
export const setUserfeedbackAction = (userFeedback: string) => {
    const userFeedbackAction: UserfeedbackAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };
    return userFeedbackAction;
};

export default setUserfeedbackAction;
