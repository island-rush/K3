import { Dispatch } from 'redux';
import { EmitType, UndoMoveAction } from '../../../../../types';
import { UNDO_MOVE } from '../../../../../constants';
import setUserfeedbackAction from '../setUserfeedbackAction';

/**
 * Action to under a move from a plan.
 */
export const undoMove = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (gameboardMeta.planning.active) {
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

export default undoMove;
