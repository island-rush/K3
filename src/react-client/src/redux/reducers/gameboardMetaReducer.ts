import { AnyAction } from 'redux';
// prettier-ignore
import { ATC_SCRAMBLE_SELECTING, BIO_WEAPON_SELECTING, CANCEL_PLAN, COMM_INTERRUPT_SELECTING, DELETE_PLAN, DRONE_SWARM_SELECTING, GOLDEN_EYE_SELECTING, HIGHLIGHT_POSITIONS, INSURGENCY_SELECTING, MENU_SELECT, MISSILE_DISRUPT_SELECTING, NUKE_SELECTING, PIECE_CLEAR_SELECTION, PIECE_CLICK, PLAN_WAS_CONFIRMED, POSITION_SELECT, RAISE_MORALE_SELECTING, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTING, SEA_MINE_SELECTING, NO_MENU_INDEX } from '../../../../constants';
import { GameboardMetaState, HighlightPositionsAction, MenuSelectAction, PieceClickAction, PositionSelectAction } from '../../../../types';

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

        case MENU_SELECT:
            stateCopy.selectedMenuId =
                (action as MenuSelectAction).payload.selectedMenuId !== stateCopy.selectedMenuId
                    ? (action as MenuSelectAction).payload.selectedMenuId
                    : NO_MENU_INDEX;
            return stateCopy;

        case POSITION_SELECT:
            stateCopy.selectedPosition = (action as PositionSelectAction).payload.selectedPositionId;
            // stateCopy.highlightedPositions = [];
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
        case DRONE_SWARM_SELECTING:
        case ATC_SCRAMBLE_SELECTING:
        case REMOTE_SENSING_SELECTING:
            stateCopy.selectedMenuId = NO_MENU_INDEX;
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
