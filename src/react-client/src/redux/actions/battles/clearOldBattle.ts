import { CLEAR_BATTLE } from "../actionTypes";

const clearOldBattle = () => {
    return (dispatch: any, getState: any, emit: any) => {
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
