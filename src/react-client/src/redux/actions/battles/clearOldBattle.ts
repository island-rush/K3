import { Dispatch } from 'redux';
import { CLEAR_BATTLE } from '../../../../../constants';
import { ClearBattleAction, EmitType } from '../../../../../types';
import { FullState } from '../../reducers';

export const clearOldBattle = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { battle } = getState();

        const clearBattleAction: ClearBattleAction = {
            type: CLEAR_BATTLE,
            payload: {
                battle
            }
        };

        dispatch(clearBattleAction);
    };
};
