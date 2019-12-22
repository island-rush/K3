import { Dispatch } from 'redux';
import { EmitType } from '../../../constants/interfaces';
import { CONTAINER_MOVE } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';

//TODO: delete this action.
/**
 * Action to handle a container move.
 */
const containerMove = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (gameboardMeta.planning.active) {
            // get either last position from the planning moves, or selectedPosition from overall if no moves yet made

            // need other checks, such as doing it multiple times in a row prevention...other game rule checks for containers

            const lastSelectedPosition =
                gameboardMeta.planning.moves.length > 0
                    ? gameboardMeta.planning.moves[gameboardMeta.planning.moves.length - 1].positionId
                    : gameboardMeta.selectedPosition;

            dispatch({
                type: CONTAINER_MOVE,
                payload: {
                    selectedPositionId: lastSelectedPosition
                }
            });
        } else {
            dispatch(setUserfeedbackAction('Can only do container moves while actively planning...'));
        }
    };
};

export default containerMove;
