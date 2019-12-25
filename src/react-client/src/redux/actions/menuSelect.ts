import { Dispatch } from 'redux';
import { EmitType, MenuSelectAction } from '../../interfaces/interfaces';
import { MENU_SELECT } from './actionTypes';

/**
 * Dispatch to Redux store that user selected menu.
 */
export const menuSelect = (selectedMenuId: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta } = getState();

        if (!gameboardMeta.planning.active) {
            const menuSelectAction: MenuSelectAction = {
                type: MENU_SELECT,
                payload: {
                    selectedMenuId
                }
            };

            dispatch(menuSelectAction);
        }
    };
};

export default menuSelect;
