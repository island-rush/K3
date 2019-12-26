import { Dispatch } from 'redux';
import { EmitType } from '../../../../../types';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../../../types';

export const seaMines = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction('seaMines'));
    };
};

export default seaMines;
