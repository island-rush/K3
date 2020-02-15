import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { InvItemType, RodsFromGodSelectingAction, RODS_FROM_GOD_SELECTING } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const rodsFromGod = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for rods from god dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use rods from god.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already done with slice.'));
            return;
        }

        if (!gameControllers.includes(TYPE_MAIN)) {
            dispatch(setUserfeedbackAction('must be sea controller to use sea mines.'));
            return;
        }

        const rodsFromGodSelectingAction: RodsFromGodSelectingAction = {
            type: RODS_FROM_GOD_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(rodsFromGodSelectingAction);
        return;
    };
};
