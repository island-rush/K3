import { MENU_SELECT } from "./actionTypes";

const menuSelect = (selectedMenuId: number) => {
    return (dispatch: any, getState: any, emit: any) => {
        const { gameboardMeta } = getState();

        if (!gameboardMeta.planning.active) {
            dispatch({
                type: MENU_SELECT,
                payload: {
                    selectedMenuId
                }
            });
        }
    };
};

export default menuSelect;
