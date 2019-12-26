import { Dispatch } from 'redux';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from '../../../../../constants';
import { EmitType, RodsFromGodSelectingAction } from '../../../interfaces/interfaces';
import { RODS_FROM_GOD_SELECTING } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../../../types';

export const rodsFromGod = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
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
