import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { WAITING_STATUS, TYPE_MAIN } from '../../../../constants';
import { MainButtonClickRequestAction, SERVER_MAIN_BUTTON_CLICK } from '../../../../types';
import { setUserfeedbackAction } from './setUserfeedbackAction';

/**
 * Send to server that user clicked main button.
 */
export const mainButtonClick = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { battle, gameInfo, planning } = getState();

        const { gameControllers } = gameInfo;

        if (planning.isActive) {
            dispatch(setUserfeedbackAction('must handle finish plan before moving on.'));
            return;
        }

        if (battle.isActive) {
            dispatch(setUserfeedbackAction('must handle battle first before moving on'));
            return;
        }

        if (!gameControllers.includes(TYPE_MAIN)) {
            dispatch(setUserfeedbackAction('must be main controller to execute'));
            return;
        }

        if (gameInfo.gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('Already Clicked...'));
            return;
        }

        // normally confirms are obtrusive UI, and should use something else // TODO: confirm dialog box (instead of default window one, make a component for it (might be hard))
        if (!window.confirm('Are you sure you want to move on?')) {
            return;
        }

        const clientAction: MainButtonClickRequestAction = {
            type: SERVER_MAIN_BUTTON_CLICK
        };

        sendToServer(clientAction);
    };
};
