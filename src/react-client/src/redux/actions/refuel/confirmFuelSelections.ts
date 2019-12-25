import { Dispatch } from 'redux';
import { ConfirmFuelSelectionRequestAction, EmitType } from '../../../interfaces/interfaces';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../constants/otherConstants';
import { SERVER_CONFIRM_FUEL_SELECTION } from '../actionTypes';

/**
 * Action to confirm all fuel selections from specific tankers to specific aircraft.
 */
export const confirmFuelSelections = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //check the local state before sending to the server
        // const { gameboardMeta } = getState();

        //prevent sending to server if client doesn't have good data, or we know somehow its a bad time to confirm
        //(ex: not actively refueling...)

        // const { tankers, aircraft } = gameboardMeta.refuel;
        //need to send to the server what selections were made, for it to handle it...

        const { gameboardMeta } = getState();
        const { aircraft, tankers } = gameboardMeta.refuel;

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

export default confirmFuelSelections;
