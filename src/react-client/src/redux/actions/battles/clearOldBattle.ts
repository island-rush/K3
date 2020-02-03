import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { CLEAR_BATTLE } from '../../../../../constants';
import { ClearBattleAction } from '../../../../../types';

export const clearOldBattle = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { battle } = getState();

        const clearBattleAction: ClearBattleAction = {
            type: CLEAR_BATTLE,
            payload: {
                battle
            }
        };

        dispatch(clearBattleAction);
        return;
    };
};
