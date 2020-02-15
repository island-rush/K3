import { SET_USERFEEDBACK, UserfeedbackAction } from '../../../../types';

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
