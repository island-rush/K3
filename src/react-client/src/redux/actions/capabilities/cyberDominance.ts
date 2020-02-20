import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { CyberDefenseRequestAction, InvItemType, SERVER_CYBER_DEFENSE_CONFIRM } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const cyberDominance = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo, capabilities } = getState();

        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for cyber defense dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use cyber defense attack.'));
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

        const { isCyberDefenseActive } = capabilities;
        if (isCyberDefenseActive) {
            dispatch(setUserfeedbackAction('already active bro........'));
            return;
        }

        if (!window.confirm('Are you sure you want to use cyber dominance? (cyber defense)')) {
            return;
        }

        const cyberDefenseRequestAction: CyberDefenseRequestAction = {
            type: SERVER_CYBER_DEFENSE_CONFIRM,
            payload: {
                invItem
            }
        };

        sendToServer(cyberDefenseRequestAction);
        return;
    };
};
