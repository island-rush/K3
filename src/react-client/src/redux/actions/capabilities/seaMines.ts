import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SEA_MINE_SELECTING, SLICE_PLANNING_ID } from '../../../../../constants';
import { InvItemType, SeaMineSelectingAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const seaMines = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for sea mine dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use sea min.'));
            return;
        }

        //dispatch that the player is currently selecting which position to select
        const seaMineSelectingAction: SeaMineSelectingAction = {
            type: SEA_MINE_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(seaMineSelectingAction);
        return;
    };
};
