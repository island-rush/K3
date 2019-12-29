import { Socket } from 'socket.io';
import { SET_USERFEEDBACK, SOCKET_SERVER_SENDING_ACTION } from '../../constants';
import { UserfeedbackAction } from '../../types';

/**
 * Helper function to reply to user with specific userfeedback.
 */
export const sendUserFeedback = async (socket: Socket, userFeedback: string) => {
    const serverAction: UserfeedbackAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };

    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default sendUserFeedback;
