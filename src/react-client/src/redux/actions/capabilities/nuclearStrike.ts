import { Dispatch } from 'redux';
import { EmitType } from '../../../constants/interfaces';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../interfaces/classTypes';

const nuclearStrike = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction('nuclearStrike'));
    };
};

export default nuclearStrike;
