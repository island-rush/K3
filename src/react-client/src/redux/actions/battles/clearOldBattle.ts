import { Dispatch } from 'redux';
import { ClearBattleAction, EmitType } from '../../../constants/interfaces';
import { CLEAR_BATTLE } from '../actionTypes';

const clearOldBattle = () => {
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
