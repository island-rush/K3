import { Dispatch } from 'redux';
import { UNDO_FUEL_SELECTION } from '../../../../../constants';
import { EmitType, PieceType, UndoFuelSelectionAction } from '../../../../../types';
import { FullState } from '../../reducers';

/**
 * Action to undo a fuel selection from tanker to another aircraft piece.
 */
export const undoFuelSelection = (aircraftPiece: PieceType, aircraftPieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
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
