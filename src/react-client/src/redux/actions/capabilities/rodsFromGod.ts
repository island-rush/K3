import { Dispatch } from 'redux';
import { COMBAT_PHASE_ID, RODS_FROM_GOD_SELECTING, SLICE_PLANNING_ID } from '../../../../../constants';
import { EmitType, FullState, InvItemType, RodsFromGodSelectingAction } from '../../../../../types';
import setUserfeedbackAction from '../setUserfeedbackAction';

export const rodsFromGod = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for rods from god dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use rods from god.'));
            return;
        }

        //other checks that the player is allowed to select rods from god (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select

        const rodsFromGodSelectingAction: RodsFromGodSelectingAction = {
            type: RODS_FROM_GOD_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(rodsFromGodSelectingAction);
    };
};

export default rodsFromGod;
