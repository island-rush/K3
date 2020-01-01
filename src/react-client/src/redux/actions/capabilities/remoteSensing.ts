import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, REMOTE_SENSING_SELECTING, SLICE_PLANNING_ID } from '../../../../../constants';
import { InvItemType, RemoteSenseSelectingAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const remoteSensing = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for remote sensing dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use remote sensing.'));
            return;
        }

        //other checks that the player is allowed to select remote sensing (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        const remoteSenseSelectingAction: RemoteSenseSelectingAction = {
            type: REMOTE_SENSING_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(remoteSenseSelectingAction);
    };
};
