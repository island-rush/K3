import { Dispatch } from 'redux';
import { SERVER_MAIN_BUTTON_CLICK, SOCKET_CLIENT_SENDING_ACTION } from '../../../../constants';
import { EmitType, FullState, MainButtonClickRequestAction } from '../../../../types';

/**
 * Send to server that user clicked main button.
 */
export const mainButtonClick = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        //check the local state before sending to the server
        const clientAction: MainButtonClickRequestAction = {
            type: SERVER_MAIN_BUTTON_CLICK
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};
