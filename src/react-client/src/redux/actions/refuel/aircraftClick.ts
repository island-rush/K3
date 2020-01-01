import { Dispatch } from 'redux';
import { AIRCRAFT_CLICK } from '../../../../../constants';
import { AircraftClickAction, EmitType, PieceType } from '../../../../../types';
import { FullState } from '../../reducers';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

//TODO: could have more checks for current game event / phase / slice / other easy stuff that should be obvious
/**
 * Action to select aircraft to receive fuel from tanker.
 */
export const aircraftClick = (aircraftPiece: PieceType, aircraftPieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { refuel } = getState();
        const { selectedTankerPieceId, aircraft } = refuel;

        if (selectedTankerPieceId === -1) {
            dispatch(setUserfeedbackAction('must select tanker to refuel from...'));
            return;
        }

        if (aircraft[aircraftPieceIndex].tankerPieceIndex != null) {
            dispatch(setUserfeedbackAction('already selected...'));
            return;
        }

        //TODO: determine if it has enough fuel to give for this piece...

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
