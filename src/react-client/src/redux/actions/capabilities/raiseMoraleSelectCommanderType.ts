import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { ALL_COMMANDER_TYPES, SERVER_RAISE_MORALE_CONFIRM } from '../../../../../constants';
import { RaiseMoraleRequestAction, ControllerType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const raiseMoraleSelectCommanderType = (selectedCommanderType: ControllerType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
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

        sendToServer(clientAction);
        return;
    };
};
