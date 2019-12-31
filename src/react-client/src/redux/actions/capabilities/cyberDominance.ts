import { Dispatch } from 'redux';
import { EmitType, FullState, InvItemType } from '../../../../../types';
import setUserfeedbackAction from '../setUserfeedbackAction';

export const cyberDominance = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        dispatch(setUserfeedbackAction('cyberDominance'));
    };
};

export default cyberDominance;
