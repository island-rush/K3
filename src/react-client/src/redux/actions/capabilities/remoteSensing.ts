import setUserfeedbackAction from "../setUserfeedbackAction";
import { REMOTE_SENSING_SELECTING } from "../actionTypes";
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from "../../../constants/gameConstants";

const remoteSensing = (invItem: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction("wrong phase for remote sensing dude."));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction("must be in planning to use remote sensing."));
            return;
        }

        //other checks that the player is allowed to select remote sensing (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        dispatch({
            type: REMOTE_SENSING_SELECTING,
            payload: {
                invItem
            }
        });
    };
};

export default remoteSensing;
