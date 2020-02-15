import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { CyberDefenseCheckRequest, InvItemType, SERVER_CYBER_DEFENSE_CHECK } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const cyberDefenseCheck = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for cyber defense check dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use cyber defense check attack.'));
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

        if (!window.confirm('Are you sure you want to use cyber dominance check? (cyber defense)')) {
            return;
        }

        const cyberDefenseCheckRequestAction: CyberDefenseCheckRequest = {
            type: SERVER_CYBER_DEFENSE_CHECK,
            payload: {
                invItem
            }
        };

        sendToServer(cyberDefenseCheckRequestAction);
        return;
    };
};
