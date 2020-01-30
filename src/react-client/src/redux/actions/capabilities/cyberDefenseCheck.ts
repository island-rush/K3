import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SERVER_CYBER_DEFENSE_CHECK, SLICE_PLANNING_ID } from '../../../../../constants';
import { CyberDefenseCheckRequest, InvItemType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const cyberDefenseCheck = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for cyber defense check dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use cyber defense check attack.'));
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
    };
};