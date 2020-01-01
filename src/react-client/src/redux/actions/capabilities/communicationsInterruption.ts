import { Dispatch } from 'redux';
import { COMBAT_PHASE_ID, COMM_INTERRUPT_SELECTING, SLICE_PLANNING_ID } from '../../../../../constants';
import { CommInterruptSelectingAction, EmitType, InvItemType } from '../../../../../types';
import { FullState } from '../../reducers';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const communicationsInterruption = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for comm interrupt dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use comm interrupt.'));
            return;
        }

        //other checks that the player is allowed to select comm interrupt (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        const commInterruptSelectingAction: CommInterruptSelectingAction = {
            type: COMM_INTERRUPT_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(commInterruptSelectingAction);
    };
};
