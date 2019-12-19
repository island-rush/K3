import { Dispatch } from "redux";
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from "../../../constants/gameConstants";
import { EmitType, InvItemType } from "../../../constants/interfaces";
import { INSURGENCY_SELECTING } from "../actionTypes";
import setUserfeedbackAction from "../setUserfeedbackAction";

const insurgency = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction("wrong phase for insurgency dude."));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction("must be in planning to use insurgency."));
            return;
        }

        //other checks that the player is allowed to select insurgency (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        dispatch({
            type: INSURGENCY_SELECTING,
            payload: {
                invItem
            }
        });
    };
};

export default insurgency;
