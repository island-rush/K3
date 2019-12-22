import { Dispatch } from 'redux';
import { ALL_COMMANDER_TYPES } from '../../../constants/gameConstants';
import { EmitType, RaiseMoraleRequestAction } from '../../../constants/interfaces';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../constants/otherConstants';
import { SERVER_RAISE_MORALE_CONFIRM } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';

const raiseMoraleSelectCommanderType = (selectedCommanderType: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();
        const { invItem } = gameboardMeta.planning;

        if (!ALL_COMMANDER_TYPES.includes(selectedCommanderType)) {
            dispatch(setUserfeedbackAction("didn't select valid commander type"));
            return;
        }

        const clientAction: RaiseMoraleRequestAction = {
            type: SERVER_RAISE_MORALE_CONFIRM,
            payload: {
                invItem,
                selectedCommanderType
            }
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
        return;
    };
};

export default raiseMoraleSelectCommanderType;
