import { Socket } from "socket.io";
import { SOCKET_SERVER_SENDING_ACTION } from "../../react-client/src/constants/otherConstants";
import { SET_USERFEEDBACK } from "../../react-client/src/redux/actions/actionTypes";

const sendUserFeedback = async (socket: Socket, userFeedback: string) => {
    const serverAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };

    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default sendUserFeedback;
