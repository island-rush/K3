import { Dispatch } from 'redux';
import { NEWSPOPUP_MINIMIZE_TOGGLE } from '../../../../constants';
import { EmitType, FullState, NewsPopupToggleAction } from '../../../../types';

/**
 * Dispatch to state that user toggled minimize for news popup.
 */
export const newsPopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const newsPopupMinimizeToggleAction: NewsPopupToggleAction = {
            type: NEWSPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(newsPopupMinimizeToggleAction);
    };
};
