import { Dispatch } from 'redux';
import { EmitType } from '../../../interfaces/interfaces';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../interfaces/classTypes';

export const seaMines = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction('seaMines'));
    };
};

export default seaMines;
