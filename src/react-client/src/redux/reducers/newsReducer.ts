import { AnyAction } from 'redux';
import { INITIAL_GAMESTATE, NEWSPOPUP_MINIMIZE_TOGGLE, NEWS_PHASE, PURCHASE_PHASE } from '../../../../constants';
import { GameInitialStateAction, NewsPhaseAction, NewsState } from '../../../../types';

const initialNewsState: NewsState = {
    isMinimized: false,
    active: false,
    newsTitle: 'Loading Title...',
    newsInfo: 'Loading Info...'
};

export function newsReducer(state = initialNewsState, action: AnyAction) {
    const { type } = action;

    let stateCopy: NewsState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            if ((action as GameInitialStateAction).payload.news) {
                stateCopy.newsTitle = (action as GameInitialStateAction).payload.news!.newsTitle;
                stateCopy.newsInfo = (action as GameInitialStateAction).payload.news!.newsInfo;
                stateCopy.active = true;
                stateCopy.isMinimized = false;
            }
            return stateCopy;

        case NEWS_PHASE:
            return (action as NewsPhaseAction).payload.news;

        case PURCHASE_PHASE:
            stateCopy.active = false;
            return stateCopy;

        case NEWSPOPUP_MINIMIZE_TOGGLE:
            stateCopy.isMinimized = !stateCopy.isMinimized;
            return stateCopy;

        default:
            // Do nothing
            return state;
    }
}
