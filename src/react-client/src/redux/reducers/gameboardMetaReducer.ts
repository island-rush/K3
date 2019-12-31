//TODO: make this file less thiccc, it's getting pretty hefty (maybe use more reducers to keep it clean....)
import { AnyAction } from 'redux';
// prettier-ignore
import { BIO_WEAPON_SELECTING, CANCEL_PLAN, COMM_INTERRUPT_SELECTING, DELETE_PLAN, GOLDEN_EYE_SELECTING, HIGHLIGHT_POSITIONS, INITIAL_GAMESTATE, INSURGENCY_SELECTING, MENU_SELECT, NEWSPOPUP_MINIMIZE_TOGGLE, NEWS_PHASE, PIECE_CLEAR_SELECTION, PIECE_CLICK, PLAN_WAS_CONFIRMED, POSITION_SELECT, PURCHASE_PHASE, RAISE_MORALE_SELECTING, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTING } from '../../../../constants';
// prettier-ignore
import { GameboardMetaState, GameInitialStateAction, HighlightPositionsAction, MenuSelectAction, NewsPhaseAction, PieceClickAction, PositionSelectAction } from '../../../../types';

const initialGameboardMeta: GameboardMetaState = {
    //TODO: change to selectedPositionId and selectedPieceId to better represent the values (ints) (and also selectedBattlePiece -> selectedBattlePieceId)
    selectedPosition: -1, //TODO: constant for 'NOTHING_SELECTED_VALUE' = -1
    highlightedPositions: [],
    selectedPiece: null,
    selectedMenuId: 0, //TODO: should probably 0 index this instead of 1 index (make -1 == no menu open)
    news: {
        isMinimized: false,
        active: false,
        newsTitle: 'Loading Title...',
        newsInfo: 'Loading Info...'
    }
};

export function gameboardMetaReducer(state = initialGameboardMeta, action: AnyAction) {
    const { type } = action;

    let stateCopy: GameboardMetaState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            //TODO: refactor to not do this
            Object.assign(stateCopy, (action as GameInitialStateAction).payload.gameboardMeta);
            return stateCopy;

        case HIGHLIGHT_POSITIONS:
            stateCopy.highlightedPositions = (action as HighlightPositionsAction).payload.highlightedPositions;
            return stateCopy;

        case MENU_SELECT:
            stateCopy.selectedMenuId =
                (action as MenuSelectAction).payload.selectedMenuId !== stateCopy.selectedMenuId
                    ? (action as MenuSelectAction).payload.selectedMenuId
                    : 0;
            return stateCopy;

        case POSITION_SELECT:
            stateCopy.selectedPosition = (action as PositionSelectAction).payload.selectedPositionId;
            // stateCopy.highlightedPositions = [];
            return stateCopy;

        case PURCHASE_PHASE:
            stateCopy.news.active = false; //hide the popup
            return stateCopy;

        case NEWS_PHASE:
            stateCopy.news = (action as NewsPhaseAction).payload.news;
            return stateCopy;

        case PIECE_CLICK:
            stateCopy.selectedPiece = (action as PieceClickAction).payload.selectedPiece;
            return stateCopy;

        case PIECE_CLEAR_SELECTION:
            stateCopy.selectedPiece = null;
            return stateCopy;

        case RAISE_MORALE_SELECTING:
            stateCopy.selectedMenuId = 0;
            return stateCopy;

        case INSURGENCY_SELECTING:
        case BIO_WEAPON_SELECTING:
        case COMM_INTERRUPT_SELECTING:
        case RODS_FROM_GOD_SELECTING:
        case GOLDEN_EYE_SELECTING:
        case REMOTE_SENSING_SELECTING:
            stateCopy.selectedMenuId = 0;
            return stateCopy;

        case CANCEL_PLAN:
            stateCopy.selectedPiece = null;
            return stateCopy;

        case PLAN_WAS_CONFIRMED:
            stateCopy.selectedPiece = null;
            return stateCopy;

        case DELETE_PLAN:
            stateCopy.selectedPiece = null;
            return stateCopy;

        case NEWSPOPUP_MINIMIZE_TOGGLE:
            stateCopy.news.isMinimized = !stateCopy.news.isMinimized;
            return stateCopy;

        default:
            return state;
    }
}

export default gameboardMetaReducer;
