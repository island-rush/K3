import { Dispatch } from 'redux';
import { UNDO_MOVE } from '../../../../../constants';
import { EmitType, FullState, UndoMoveAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to under a move from a plan.
 */
export const undoMove = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { planning } = getState();

        if (planning.active) {
            const undoMoveAction: UndoMoveAction = {
                type: UNDO_MOVE,
                payload: {}
            };

            dispatch(undoMoveAction);
        } else {
            dispatch(setUserfeedbackAction('Can only undo while actively planning'));
        }
    };
};
