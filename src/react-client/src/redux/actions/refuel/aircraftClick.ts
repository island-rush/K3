import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, TYPE_AIR, WAITING_STATUS } from '../../../../../constants';
import { AircraftClickAction, AIRCRAFT_CLICK, PieceType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

// TODO: could have more checks for current game event / phase / slice / other easy stuff that should be obvious
/**
 * Action to select aircraft to receive fuel from tanker.
 */
export const aircraftClick = (aircraftPiece: PieceType, aircraftPieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { refuel, gameInfo } = getState();
        const { selectedTankerPieceId, aircraft } = refuel;

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

        if (selectedTankerPieceId === -1) {
            dispatch(setUserfeedbackAction('must select tanker to refuel from...'));
            return;
        }

        if (aircraft[aircraftPieceIndex].tankerPieceIndex != null) {
            dispatch(setUserfeedbackAction('already selected...'));
            return;
        }

        // TODO: determine if it has enough fuel to give for this piece...

        const aircraftClickAction: AircraftClickAction = {
            type: AIRCRAFT_CLICK,
            payload: {
                aircraftPiece,
                aircraftPieceIndex
            }
        };

        dispatch(aircraftClickAction);
        return;
    };
};
