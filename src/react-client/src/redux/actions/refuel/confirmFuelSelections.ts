import { Dispatch } from 'redux';
import { SERVER_CONFIRM_FUEL_SELECTION, SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { ConfirmFuelSelectionRequestAction, EmitType, FullState } from '../../../../../types';

/**
 * Action to confirm all fuel selections from specific tankers to specific aircraft.
 */
export const confirmFuelSelections = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
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

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};
