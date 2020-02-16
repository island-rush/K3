import { AnyAction } from 'redux';
import { INV_MENU_INDEX, NO_MENU_INDEX, SHOP_MENU_INDEX } from '../../../../constants';
// prettier-ignore
import { ATC_SCRAMBLE_SELECTING, BIO_WEAPON_SELECTING, CANCEL_CONTAINER_PLACEMENT, CANCEL_PLAN, COMBAT_PHASE, COMM_INTERRUPT_SELECTING, DELETE_PLAN, DRONE_SWARM_SELECTING, GameboardMetaState, GOLDEN_EYE_SELECTING, HighlightPositionsAction, HIGHLIGHT_POSITIONS, INNER_PIECE_CLICK_ACTION, INSURGENCY_SELECTING, MenuSelectAction, MENU_SELECT, MISSILE_DISRUPT_SELECTING, NEWS_PHASE, NUKE_SELECTING, PieceClickAction, PIECE_CLEAR_SELECTION, PIECE_CLICK, PIECE_PLACE, PIECE_PLACE_START, PLACE_PHASE, PLAN_WAS_CONFIRMED, PositionSelectAction, POSITION_SELECT, PURCHASE_PHASE, RAISE_MORALE_SELECTING, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTING, SEA_MINE_SELECTING } from '../../../../types';

const initialGameboardMeta: GameboardMetaState = {
    // TODO: change to selectedPositionId and selectedPieceId to better represent the values (ints) (and also selectedBattlePiece -> selectedBattlePieceId)
    selectedPosition: -1, // TODO: constant for 'NOTHING_SELECTED_VALUE' = -1
    highlightedPositions: [],
    selectedPiece: null,
    selectedMenuId: NO_MENU_INDEX
};

export function gameboardMetaReducer(state = initialGameboardMeta, action: AnyAction) {
    const { type } = action;

    let stateCopy: GameboardMetaState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case HIGHLIGHT_POSITIONS:
            stateCopy.highlightedPositions = (action as HighlightPositionsAction).payload.highlightedPositions;
            return stateCopy;

        case CANCEL_CONTAINER_PLACEMENT:
        case INNER_PIECE_CLICK_ACTION:
            stateCopy.highlightedPositions = [];
            return stateCopy;

        case MENU_SELECT:
            stateCopy.selectedMenuId =
                (action as MenuSelectAction).payload.selectedMenuId !== stateCopy.selectedMenuId
                    ? (action as MenuSelectAction).payload.selectedMenuId
                    : NO_MENU_INDEX;
            return stateCopy;

        case PIECE_PLACE_START:
            stateCopy.selectedMenuId = NO_MENU_INDEX;
            return stateCopy;

        case PIECE_PLACE:
            stateCopy.selectedMenuId = INV_MENU_INDEX;
            return stateCopy;

        case POSITION_SELECT:
            stateCopy.selectedPosition = (action as PositionSelectAction).payload.selectedPositionId;
            stateCopy.selectedPiece = null;
            return stateCopy;

        case PIECE_CLICK:
            stateCopy.selectedPiece = (action as PieceClickAction).payload.selectedPiece;
            return stateCopy;

        case RAISE_MORALE_SELECTING:
        case INSURGENCY_SELECTING:
        case BIO_WEAPON_SELECTING:
        case COMM_INTERRUPT_SELECTING:
        case RODS_FROM_GOD_SELECTING:
        case GOLDEN_EYE_SELECTING:
        case SEA_MINE_SELECTING:
        case MISSILE_DISRUPT_SELECTING:
        case NUKE_SELECTING:
        case NEWS_PHASE:
        case COMBAT_PHASE:
        case PLACE_PHASE:
        case DRONE_SWARM_SELECTING:
        case ATC_SCRAMBLE_SELECTING:
        case REMOTE_SENSING_SELECTING:
            stateCopy.selectedMenuId = NO_MENU_INDEX;
            return stateCopy;

        case PURCHASE_PHASE:
            stateCopy.selectedMenuId = SHOP_MENU_INDEX;
            return stateCopy;

        case PIECE_CLEAR_SELECTION:
        case CANCEL_PLAN:
        case PLAN_WAS_CONFIRMED:
        case DELETE_PLAN:
            stateCopy.selectedPiece = null;
            return stateCopy;

        default:
            // Do nothing
            return state;
    }
}
