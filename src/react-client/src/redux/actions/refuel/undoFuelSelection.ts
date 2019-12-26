import { Dispatch } from 'redux';
import { EmitType, UndoFuelSelectionAction } from '../../../interfaces/interfaces';
import { UNDO_FUEL_SELECTION } from '../actionTypes';
import { PieceType } from '../../../../../types';

/**
 * Action to undo a fuel selection from tanker to another aircraft piece.
 */
export const undoFuelSelection = (aircraftPiece: PieceType, aircraftPieceIndex: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        // const { gameboardMeta } = getState();
        // const { selectedTankerPieceId } = gameboardMeta.refuel;

        //TODO: determine if it can undo the selection...

        const undoFuelSelectionAction: UndoFuelSelectionAction = {
            type: UNDO_FUEL_SELECTION,
            payload: {
                aircraftPiece,
                aircraftPieceIndex
            }
        };

        dispatch(undoFuelSelectionAction);
        return;
    };
};

export default undoFuelSelection;
