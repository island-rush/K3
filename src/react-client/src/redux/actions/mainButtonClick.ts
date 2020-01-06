import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { SERVER_MAIN_BUTTON_CLICK } from '../../../../constants';
import { MainButtonClickRequestAction } from '../../../../types';

/**
 * Send to server that user clicked main button.
 */
export const mainButtonClick = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const clientAction: MainButtonClickRequestAction = {
            type: SERVER_MAIN_BUTTON_CLICK
        };

        sendToServer(clientAction);
    };
};
