import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { InvItemType, NukeSelectingAction, NUKE_SELECTING } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const nuclearStrike = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for nuke dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use nuke.'));
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
