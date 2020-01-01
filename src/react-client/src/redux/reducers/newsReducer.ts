import { INITIAL_GAMESTATE, NEWSPOPUP_MINIMIZE_TOGGLE, NEWS_PHASE, PURCHASE_PHASE } from '../../../../constants';
import { GameInitialStateAction, NewsPhaseAction, NewsPopupToggleAction, NewsState, PurchasePhaseAction } from '../../../../types';

type NewsReducerActions = GameInitialStateAction | NewsPhaseAction | PurchasePhaseAction | NewsPopupToggleAction;

const initialNewsState: NewsState = {
    isMinimized: false,
    active: false,
    newsTitle: 'Loading Title...',
    newsInfo: 'Loading Info...'
};

export function newsReducer(state = initialNewsState, action: NewsReducerActions) {
    const { type } = action;

    let stateCopy: NewsState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            if ((action as GameInitialStateAction).payload.news) {
                stateCopy = (action as GameInitialStateAction).payload.news;
            }
            return stateCopy;

        case NEWS_PHASE:
            return (action as NewsPhaseAction).payload.news;

        case PURCHASE_PHASE:
            stateCopy.active = false; //hide the popup
            return stateCopy;

        case NEWSPOPUP_MINIMIZE_TOGGLE:
            stateCopy.isMinimized = !stateCopy.isMinimized;
            return stateCopy;

        default:
            return state;
    }
}
