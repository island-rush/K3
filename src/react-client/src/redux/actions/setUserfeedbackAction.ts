import { SET_USERFEEDBACK, UserfeedbackAction } from '../../../../types';

/**
 * Helper function to create Redux Action to send userfeedback to the state.
 */
export const setUserfeedbackAction = (userFeedback: string) => {
    // TODO: this function might be repeated on the server side, may want to consolidate
    const userFeedbackAction: UserfeedbackAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };

    return userFeedbackAction;
};
