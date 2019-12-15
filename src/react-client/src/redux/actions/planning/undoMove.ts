import { UNDO_MOVE } from "../actionTypes";
import setUserfeedbackAction from "../setUserfeedbackAction";

const undoMove = () => {
    return (dispatch: any, getState: any, emit: any) => {
        const { gameboardMeta } = getState();

        if (gameboardMeta.planning.active) {
            dispatch({
                type: UNDO_MOVE
            });
        } else {
            dispatch(setUserfeedbackAction("Can only undo while actively planning"));
        }
    };
};

export default undoMove;
