import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, NUKE_SELECTING, SLICE_PLANNING_ID } from '../../../../../constants';
import { InvItemType, NukeSelectingAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const nuclearStrike = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for nuke dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use nuke.'));
            return;
        }

        //dispatch that the player is currently selecting which position to select
        const nukeSelectingAction: NukeSelectingAction = {
            type: NUKE_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(nukeSelectingAction);
        return;
    };
};
