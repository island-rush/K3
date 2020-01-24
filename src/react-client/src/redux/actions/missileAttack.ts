import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { setUserfeedbackAction } from './setUserfeedbackAction';

/**
 * Action to use missile in a silo to target a sea piece nearby.
 */
export const missileAttack = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        dispatch(setUserfeedbackAction('missile attack function'));
    };
};
