import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { AntiSatRequestAction, InvItemType, SERVER_ANTISAT_CONFIRM } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const antiSatelliteMissiles = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for anti sat attack dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use anti sat attack.'));
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

        if (!window.confirm('Are you sure you want to use an anti sat missile?')) {
            dispatch(setUserfeedbackAction('opted to not use anti sat missiles for now.'));
            return;
        }

        //dispatch that the player is currently selecting which position to select
        const antiSatRequestAction: AntiSatRequestAction = {
            type: SERVER_ANTISAT_CONFIRM,
            payload: {
                invItem
            }
        };

        sendToServer(antiSatRequestAction);
        return;
    };
};
