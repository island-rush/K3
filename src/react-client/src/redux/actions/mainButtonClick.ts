import { Dispatch } from 'redux';
import { EmitType, MainButtonClickRequestAction } from '../../../../types';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../../constants';
import { SERVER_MAIN_BUTTON_CLICK } from './actionTypes';

/**
 * Send to server that user clicked main button.
 */
export const mainButtonClick = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //check the local state before sending to the server
        const clientAction: MainButtonClickRequestAction = {
            type: SERVER_MAIN_BUTTON_CLICK
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default mainButtonClick;
