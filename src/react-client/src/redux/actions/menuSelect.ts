import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { MENU_SELECT, SHOP_MENU_INDEX, INV_MENU_INDEX, SPACE_MENU_INDEX, GAME_INFO_MENU_INDEX, NO_MENU_INDEX } from '../../../../constants';
import { MenuSelectAction } from '../../../../types';

/**
 * Dispatch to Redux store that user selected menu.
 */
export const menuSelect = (
    selectedMenuId: typeof SHOP_MENU_INDEX | typeof INV_MENU_INDEX | typeof SPACE_MENU_INDEX | typeof GAME_INFO_MENU_INDEX | typeof NO_MENU_INDEX
) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { planning } = getState();

        if (!planning.isActive) {
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
