import { Dispatch } from 'redux';
import { EmitType } from '../../../../../types';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../../../types';

export const nuclearStrike = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction('nuclearStrike'));
    };
};

export default nuclearStrike;
