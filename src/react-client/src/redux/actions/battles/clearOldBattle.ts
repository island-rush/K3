import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { ClearBattleAction, CLEAR_BATTLE } from '../../../../../types';

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
