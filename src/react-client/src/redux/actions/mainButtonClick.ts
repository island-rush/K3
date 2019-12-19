import { DispatchType, EmitType, ReduxAction } from "../../constants/interfaces";
import { SOCKET_CLIENT_SENDING_ACTION } from "../../constants/otherConstants";
import { SERVER_MAIN_BUTTON_CLICK } from "./actionTypes";

/**
 * Send to server that user clicked main button.
 */
const mainButtonClick = () => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        //check the local state before sending to the server
        const clientAction: ReduxAction = {
            type: SERVER_MAIN_BUTTON_CLICK,
            payload: {}
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default mainButtonClick;
