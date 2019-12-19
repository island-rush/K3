import { DispatchType, EmitType, PieceType } from "../../../constants/interfaces";
import { UNDO_FUEL_SELECTION } from "../actionTypes";

/**
 * Action to undo a fuel selection from tanker to another aircraft piece.
 */
const undoFuelSelection = (aircraftPiece: PieceType, aircraftPieceIndex: number) => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        // const { gameboardMeta } = getState();
        // const { selectedTankerPieceId } = gameboardMeta.refuel;

        //TODO: determine if it can undo the selection...

        dispatch({
            type: UNDO_FUEL_SELECTION,
            payload: {
                aircraftPiece,
                aircraftPieceIndex
            }
        });
        return;
    };
};

export default undoFuelSelection;
