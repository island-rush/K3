import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { AtcScrambleSelectingAction, ATC_SCRAMBLE_SELECTING, InvItemType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const atcScramble = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for atc scramble dude.')); // TODO: this accidentally had 'drone swarm' from copy / paste, make sure similar functions aren't wrong
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use atc scramble.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already clicked to continue'));
            return;
        }

        if (!gameControllers.includes(TYPE_MAIN)) {
            dispatch(setUserfeedbackAction('must be main controller to use'));
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
        return;
    };
};
