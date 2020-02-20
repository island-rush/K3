import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { NewsPopupToggleAction, NEWSPOPUP_MINIMIZE_TOGGLE } from '../../../../types';

/**
 * Dispatch to state that user toggled minimize for news popup.
 */
export const newsPopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const newsPopupMinimizeToggleAction: NewsPopupToggleAction = {
            type: NEWSPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(newsPopupMinimizeToggleAction);
    };
};
