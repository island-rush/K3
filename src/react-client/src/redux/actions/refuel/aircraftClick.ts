import { AIRCRAFT_CLICK } from "../actionTypes";
import setUserfeedbackAction from "../setUserfeedbackAction";

//TODO: could have more checks for current game event / phase / slice / other easy stuff that should be obvious
const aircraftClick = (aircraftPiece: any, aircraftPieceIndex: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        const { gameboardMeta } = getState();
        const { selectedTankerPieceId, aircraft } = gameboardMeta.refuel;

        if (parseInt(selectedTankerPieceId) === -1) {
            dispatch(setUserfeedbackAction("must select tanker to refuel from..."));
            return;
        }

        if (aircraft[aircraftPieceIndex].tankerPieceIndex != null) {
            dispatch(setUserfeedbackAction("already selected..."));
            return;
        }

        //TODO: determine if it has enough fuel to give for this piece...

        dispatch({
            type: AIRCRAFT_CLICK,
            payload: {
                aircraftPiece,
                aircraftPieceIndex
            }
        });
        return;
    };
};

export default aircraftClick;
