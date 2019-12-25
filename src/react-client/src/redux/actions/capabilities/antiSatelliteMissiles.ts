import { Dispatch } from 'redux';
import { EmitType } from '../../../interfaces/interfaces';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../interfaces/classTypes';

export const antiSatelliteMissiles = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction('antiSatelliteMissiles'));
    };
};

export default antiSatelliteMissiles;
