import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { WAITING_STATUS } from '../../../../constants';
import { MainButtonClickRequestAction, SERVER_MAIN_BUTTON_CLICK } from '../../../../types';
import { setUserfeedbackAction } from './setUserfeedbackAction';

/**
 * Send to server that user clicked main button.
 */
export const mainButtonClick = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { battle, gameInfo, planning } = getState();

        if (planning.isActive) {
            dispatch(setUserfeedbackAction('must handle finish plan before moving on.'));
            return;
        }

        if (battle.isActive) {
            dispatch(setUserfeedbackAction('must handle battle first before moving on'));
            return;
        }

        if (gameInfo.gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('Already Clicked...'));
            return;
        }

        const clientAction: MainButtonClickRequestAction = {
            type: SERVER_MAIN_BUTTON_CLICK
        };

        sendToServer(clientAction);
    };
};
