import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { UndoMoveAction, UNDO_MOVE } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';
import { TYPE_SPECIAL, TYPE_AIR, TYPE_LAND, TYPE_SEA } from '../../../../../constants';

/**
 * Action to under a move from a plan.
 */
export const undoMove = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { planning, gameInfo } = getState();

        if (planning.bombardmentSelecting !== null || planning.missileSelecting !== null || planning.isUsingCapability) {
            dispatch(setUserfeedbackAction("Button doesn't apply to capability"));
            return;
        }

        if (planning.isActive) {
            const { gameControllers } = gameInfo;
            if (
                !gameControllers.includes(TYPE_AIR) &&
                !gameControllers.includes(TYPE_LAND) &&
                !gameControllers.includes(TYPE_SEA) &&
                !gameControllers.includes(TYPE_SPECIAL)
            ) {
                dispatch(setUserfeedbackAction('main commander by his/herself cant make piece plans, must be in control of piece.'));
                return;
            }

            if (planning.moves.length === 0) {
                dispatch(setUserfeedbackAction('no more moves to undo...ma dude'));
                return;
            }

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
