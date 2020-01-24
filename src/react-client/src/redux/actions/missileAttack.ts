import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { PieceType } from '../../../../types';
import { setUserfeedbackAction } from './setUserfeedbackAction';

/**
 * Action to use missile in a silo to target a sea piece nearby.
 */
export const missileAttack = (piece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        dispatch(setUserfeedbackAction('missile attack function'));
    };
};
