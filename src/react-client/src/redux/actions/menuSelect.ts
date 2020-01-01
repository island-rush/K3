import { Dispatch } from 'redux';
import { MENU_SELECT } from '../../../../constants';
import { EmitType, MenuSelectAction } from '../../../../types';
import { FullState } from '../reducers';

/**
 * Dispatch to Redux store that user selected menu.
 */
export const menuSelect = (selectedMenuId: number) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { planning } = getState();

        if (!planning.active) {
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
