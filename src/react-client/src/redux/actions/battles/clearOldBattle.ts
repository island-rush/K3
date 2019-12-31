import { Dispatch } from 'redux';
import { CLEAR_BATTLE } from '../../../../../constants';
import { ClearBattleAction, EmitType, FullState } from '../../../../../types';

export const clearOldBattle = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { gameboardMeta } = getState();
        const { battle } = gameboardMeta;

        const clearBattleAction: ClearBattleAction = {
            type: CLEAR_BATTLE,
            payload: {
                battle
            }
        };

        dispatch(clearBattleAction);
    };
};

export default clearOldBattle;
