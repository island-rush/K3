import { Dispatch } from 'redux';
import { EmitType, NewsPopupToggleAction } from '../../../../types';
import { NEWSPOPUP_MINIMIZE_TOGGLE } from './actionTypes';

/**
 * Dispatch to state that user toggled minimize for news popup.
 */
export const newsPopupMinimizeToggle = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const newsPopupMinimizeToggleAction: NewsPopupToggleAction = {
            type: NEWSPOPUP_MINIMIZE_TOGGLE,
            payload: {}
        };

        dispatch(newsPopupMinimizeToggleAction);
    };
};

export default newsPopupMinimizeToggle;
