import { Dispatch } from 'redux';
import { EmitType } from '../../../constants/interfaces';
import { UNDO_MOVE } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';

/**
 * Action to under a move from a plan.
 */
const undoMove = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (gameboardMeta.planning.active) {
            dispatch({
                type: UNDO_MOVE,
                payload: {}
            });
        } else {
            dispatch(setUserfeedbackAction('Can only undo while actively planning'));
        }
    };
};

export default undoMove;
