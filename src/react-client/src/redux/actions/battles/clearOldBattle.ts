import { Dispatch } from 'redux';
import { EmitType } from '../../../constants/interfaces';
import { CLEAR_BATTLE } from '../actionTypes';

const clearOldBattle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();
        const { battle } = gameboardMeta;

        dispatch({
            type: CLEAR_BATTLE,
            payload: {
                battle
            }
        });
    };
};

export default clearOldBattle;
