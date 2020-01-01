import { Dispatch } from 'redux';
import { ALL_COMMANDER_TYPES, SERVER_RAISE_MORALE_CONFIRM, SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { EmitType, RaiseMoraleRequestAction } from '../../../../../types';
import { FullState } from '../../reducers';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const raiseMoraleSelectCommanderType = (selectedCommanderType: number) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { planning }: any = getState();
        const { invItem } = planning;

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
