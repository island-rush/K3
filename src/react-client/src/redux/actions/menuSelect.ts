import { Dispatch } from 'redux';
import { EmitType } from '../../constants/interfaces';
import { MENU_SELECT } from './actionTypes';

/**
 * Dispatch to Redux store that user selected menu.
 */
const menuSelect = (selectedMenuId: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
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
