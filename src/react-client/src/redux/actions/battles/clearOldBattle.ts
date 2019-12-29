import { Dispatch } from 'redux';
import { CLEAR_BATTLE } from '../../../../../constants';
import { ClearBattleAction, EmitType } from '../../../../../types';

export const clearOldBattle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
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
