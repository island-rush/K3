import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, WAITING_STATUS, TYPE_SEA } from '../../../../../constants';
import { InvItemType, SeaMineSelectingAction, SEA_MINE_SELECTING } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const seaMines = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for sea mine dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use sea min.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already done with slice.'));
            return;
        }

        if (!gameControllers.includes(TYPE_SEA)) {
            dispatch(setUserfeedbackAction('must be sea controller to use sea mines.'));
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
