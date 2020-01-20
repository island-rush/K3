import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { InvItemType, AtcScrambleSelectingAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, ATC_SCRAMBLE_SELECTING } from '../../../../../constants';

export const atcScramble = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for drone swarm dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use drone swarm.'));
            return;
        }

        //dispatch that the player is currently selecting which position to select
        const atcScrambleSelectingAction: AtcScrambleSelectingAction = {
            type: ATC_SCRAMBLE_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(atcScrambleSelectingAction);
    };
};
