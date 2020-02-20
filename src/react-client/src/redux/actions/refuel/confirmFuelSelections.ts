import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { ConfirmFuelSelectionRequestAction, SERVER_CONFIRM_FUEL_SELECTION } from '../../../../../types';
import { TYPE_AIR, COMBAT_PHASE_ID, WAITING_STATUS } from '../../../../../constants';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to confirm all fuel selections from specific tankers to specific aircraft.
 */
export const confirmFuelSelections = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo, refuel } = getState();

        const { gameControllers, gameStatus, gamePhase } = gameInfo;

        if (!gameControllers.includes(TYPE_AIR)) {
            dispatch(setUserfeedbackAction('must be air commander to do refueling'));
            return;
        }

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('must be combat phase to open air refuel.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already confirmed waiting for other team.'));
            return;
        }

        // TODO: could do more fuel transfer checking (prevent malicious data if possible?)
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
