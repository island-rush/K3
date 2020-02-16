import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, TYPE_AIR, WAITING_STATUS } from '../../../../../constants';
import { PieceType, UndoFuelSelectionAction, UNDO_FUEL_SELECTION } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to undo a fuel selection from tanker to another aircraft piece.
 */
export const undoFuelSelection = (aircraftPiece: PieceType, aircraftPieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

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
