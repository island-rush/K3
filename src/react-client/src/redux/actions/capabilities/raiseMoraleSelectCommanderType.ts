import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { ALL_COMMANDER_TYPES, COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { ControllerType, RaiseMoraleRequestAction, SERVER_RAISE_MORALE_CONFIRM } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const raiseMoraleSelectCommanderType = (selectedCommanderType: ControllerType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { planning, gameInfo } = getState();
        const { gamePhase, gameSlice, gameControllers, gameStatus } = gameInfo;
        const { invItem } = planning;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('must be in combat'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning slice'));
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

        if (!ALL_COMMANDER_TYPES.includes(selectedCommanderType)) {
            dispatch(setUserfeedbackAction("didn't select valid commander type"));
            return;
        }

        if (invItem === null) {
            dispatch(setUserfeedbackAction('didnt have invItem to use'));
            return;
        }

        const clientAction: RaiseMoraleRequestAction = {
            type: SERVER_RAISE_MORALE_CONFIRM,
            payload: {
                invItem,
                selectedCommanderType
            }
        };

        sendToServer(clientAction);
        return;
    };
};
