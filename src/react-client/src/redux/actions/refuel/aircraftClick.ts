import { Dispatch } from 'redux';
import { AircraftClickAction, EmitType } from '../../../interfaces/interfaces';
import { AIRCRAFT_CLICK } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { PieceType } from '../../../../../types';

//TODO: could have more checks for current game event / phase / slice / other easy stuff that should be obvious
/**
 * Action to select aircraft to receive fuel from tanker.
 */
export const aircraftClick = (aircraftPiece: PieceType, aircraftPieceIndex: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();
        const { selectedTankerPieceId, aircraft } = gameboardMeta.refuel;

        if (parseInt(selectedTankerPieceId) === -1) {
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

export default aircraftClick;
