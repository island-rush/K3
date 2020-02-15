import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { ConfirmFuelSelectionRequestAction, SERVER_CONFIRM_FUEL_SELECTION } from '../../../../../types';

/**
 * Action to confirm all fuel selections from specific tankers to specific aircraft.
 */
export const confirmFuelSelections = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        //check the local state before sending to the server
        // const { gameboardMeta } = getState();

        //prevent sending to server if client doesn't have good data, or we know somehow its a bad time to confirm
        //(ex: not actively refueling...)

        // const { tankers, aircraft } = gameboardMeta.refuel;
        //need to send to the server what selections were made, for it to handle it...

        const { refuel } = getState();
        const { aircraft, tankers } = refuel;

        const clientAction: ConfirmFuelSelectionRequestAction = {
            type: SERVER_CONFIRM_FUEL_SELECTION,
            payload: {
                aircraft,
                tankers
            }
        };

        sendToServer(clientAction);
        return;
    };
};
