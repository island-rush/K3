import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { UNDO_MOVE } from '../../../../../constants';
import { UndoMoveAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to under a move from a plan.
 */
export const undoMove = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { planning } = getState();

        // TODO: this might still work when capability planning or something
        if (planning.isActive) {
            const undoMoveAction: UndoMoveAction = {
                type: UNDO_MOVE,
                payload: {}
            };

            dispatch(undoMoveAction);
            return;
        }

        dispatch(setUserfeedbackAction('Can only undo while actively planning'));
        return;
    };
};
