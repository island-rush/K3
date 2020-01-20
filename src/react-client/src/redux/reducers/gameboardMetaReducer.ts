// prettier-ignore
import { BIO_WEAPON_SELECTING, CANCEL_PLAN, COMM_INTERRUPT_SELECTING, DELETE_PLAN, DRONE_SWARM_SELECTING, GOLDEN_EYE_SELECTING, HIGHLIGHT_POSITIONS, INSURGENCY_SELECTING, MENU_SELECT, PIECE_CLEAR_SELECTION, PIECE_CLICK, PLAN_WAS_CONFIRMED, POSITION_SELECT, RAISE_MORALE_SELECTING, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTING, SEA_MINE_SELECTING, ATC_SCRAMBLE_SELECTING } from '../../../../constants';
// prettier-ignore
import { BioWeaponSelectingAction, CommInterruptSelectingAction, ConfirmPlanAction, DeletePlanAction, DroneSwarmSelectingAction, GameboardMetaState, GoldenEyeSelectingAction, HighlightPositionsAction, InsurgencySelectingAction, MenuSelectAction, PieceClearAction, PieceClickAction, PositionSelectAction, PreventPlanAction, RaiseMoraleSelectingAction, RemoteSenseSelectingAction, RodsFromGodSelectingAction, SeaMineSelectingAction, AtcScrambleSelectingAction } from '../../../../types';

type GameboardMetaReducerActions =
    | HighlightPositionsAction
    | MenuSelectAction
    | PositionSelectAction
    | PieceClickAction
    | PieceClearAction
    | RaiseMoraleSelectingAction
    | InsurgencySelectingAction
    | BioWeaponSelectingAction
    | CommInterruptSelectingAction
    | RodsFromGodSelectingAction
    | GoldenEyeSelectingAction
    | RemoteSenseSelectingAction
    | PreventPlanAction
    | ConfirmPlanAction
    | SeaMineSelectingAction
    | DroneSwarmSelectingAction
    | AtcScrambleSelectingAction
    | DeletePlanAction;

const initialGameboardMeta: GameboardMetaState = {
    //TODO: change to selectedPositionId and selectedPieceId to better represent the values (ints) (and also selectedBattlePiece -> selectedBattlePieceId)
    selectedPosition: -1, //TODO: constant for 'NOTHING_SELECTED_VALUE' = -1
    highlightedPositions: [],
    selectedPiece: null,
    selectedMenuId: 0 //TODO: should probably 0 index this instead of 1 index (make -1 == no menu open)
};

export function gameboardMetaReducer(state = initialGameboardMeta, action: GameboardMetaReducerActions) {
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
                    : 0;
            return stateCopy;

        case POSITION_SELECT:
            stateCopy.selectedPosition = (action as PositionSelectAction).payload.selectedPositionId;
            // stateCopy.highlightedPositions = [];
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
        case SEA_MINE_SELECTING:
        case DRONE_SWARM_SELECTING:
        case ATC_SCRAMBLE_SELECTING:
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

        default:
            return state;
    }
}
