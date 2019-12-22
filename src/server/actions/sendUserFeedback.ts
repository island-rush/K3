import { Socket } from 'socket.io';
import { UserfeedbackAction } from '../../react-client/src/constants/interfaces';
import { SOCKET_SERVER_SENDING_ACTION } from '../../react-client/src/constants/otherConstants';
import { SET_USERFEEDBACK } from '../../react-client/src/redux/actions/actionTypes';

/**
 * Helper function to reply to user with specific userfeedback.
 */
const sendUserFeedback = async (socket: Socket, userFeedback: string) => {
    const serverAction: UserfeedbackAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };

    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default sendUserFeedback;
