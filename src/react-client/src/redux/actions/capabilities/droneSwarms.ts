import { Dispatch } from 'redux';
import { EmitType, InvItemType } from '../../../constants/interfaces';
import setUserfeedbackAction from '../setUserfeedbackAction';

const droneSwarms = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction('droneSwarms'));
    };
};

export default droneSwarms;
