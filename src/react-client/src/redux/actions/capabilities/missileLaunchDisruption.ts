import { Dispatch } from 'redux';
import { EmitType, InvItemType } from '../../../../../types';
import { FullState } from '../../reducers';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const missileLaunchDisruption = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        dispatch(setUserfeedbackAction('missileLaunchDisruption'));
    };
};
