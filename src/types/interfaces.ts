import { Action } from 'redux';
// prettier-ignore
import { AIRCRAFT_CLICK, BATTLEPOPUP_MINIMIZE_TOGGLE, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, CANCEL_PLAN, CLEAR_BATTLE, COMBAT_PHASE, DELETE_PLAN, ENEMY_PIECE_SELECT, EVENT_BATTLE, EVENT_REFUEL, HIGHLIGHT_POSITIONS, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, INNER_TRANSPORT_PIECE_CLICK_ACTION, MAIN_BUTTON_CLICK, MENU_SELECT, NEWSPOPUP_MINIMIZE_TOGGLE, NEWS_PHASE, NEW_ROUND, NO_MORE_EVENTS, OUTER_PIECE_CLICK_ACTION, PIECE_CLEAR_SELECTION, PIECE_CLICK, PIECE_CLOSE_ACTION, PIECE_OPEN_ACTION, PIECE_PLACE, PLACE_PHASE, PLANNING_SELECT, PLAN_WAS_CONFIRMED, POSITION_SELECT, PURCHASE_PHASE, REFUELPOPUP_MINIMIZE_TOGGLE, REFUEL_RESULTS, SERVER_CONFIRM_BATTLE_SELECTION, SERVER_CONFIRM_FUEL_SELECTION, SERVER_CONFIRM_PLAN, SERVER_DELETE_PLAN, SERVER_INNER_PIECE_CLICK, SERVER_INNER_TRANSPORT_PIECE_CLICK, SERVER_MAIN_BUTTON_CLICK, SERVER_OUTER_PIECE_CLICK, SERVER_PIECE_PLACE, SERVER_SHOP_CONFIRM_PURCHASE, SERVER_SHOP_PURCHASE_REQUEST, SERVER_SHOP_REFUND_REQUEST, SET_USERFEEDBACK, SHOP_PURCHASE, SHOP_REFUND, SHOP_TRANSFER, SLICE_CHANGE, START_PLAN, TANKER_CLICK, TARGET_PIECE_SELECT, UNDO_FUEL_SELECTION, UNDO_MOVE, UPDATE_FLAGS } from '../constants';
import { InvItemType, PieceType, ShopItemType } from './classes';
// prettier-ignore
import { BattleState, CapabilitiesState, GameboardMetaState, GameboardState, GameInfoState, InvState, NewsState, PlanningState, RefuelState, ShopState } from './reducerTypes';

export interface UserfeedbackAction extends Action {
    type: typeof SET_USERFEEDBACK;
    payload: {
        userFeedback: string;
    };
}

export interface PositionSelectAction extends Action {
    type: typeof POSITION_SELECT;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
}

export interface HighlightPositionsAction extends Action {
    type: typeof HIGHLIGHT_POSITIONS;
    payload: {
        highlightedPositions: GameboardMetaState['highlightedPositions'];
    };
}

export interface PlanningSelectAction extends Action {
    type: typeof PLANNING_SELECT;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
}

export interface PieceClickAction extends Action {
    type: typeof PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
    };
}

export interface PieceClearAction extends Action {
    type: typeof PIECE_CLEAR_SELECTION;
    payload: {};
}

export interface RefuelPopupToggleAction extends Action {
    type: typeof REFUELPOPUP_MINIMIZE_TOGGLE;
    payload: {};
}

export interface UndoMoveAction extends Action {
    type: typeof UNDO_MOVE;
    payload: {};
}

export interface PreventPlanAction extends Action {
    type: typeof CANCEL_PLAN;
    payload: {};
}

export interface BattlePopupToggleAction extends Action {
    type: typeof BATTLEPOPUP_MINIMIZE_TOGGLE;
    payload: {};
}

export interface BattlePieceSelectAction extends Action {
    type: typeof BATTLE_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
}

export interface ClearBattleAction extends Action {
    type: typeof CLEAR_BATTLE;
    payload: {
        battle: BattleState;
    };
}

export interface EnemyPieceSelectAction extends Action {
    type: typeof ENEMY_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
}

export interface TargetPieceClickAction extends Action {
    type: typeof TARGET_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
}

export interface StartPlanAction extends Action {
    type: typeof START_PLAN;
    payload: {};
}

export interface AircraftClickAction extends Action {
    type: typeof AIRCRAFT_CLICK;
    payload: {
        aircraftPiece: any;
        aircraftPieceIndex: number;
    };
}

export interface TankerClickAction extends Action {
    type: typeof TANKER_CLICK;
    payload: {
        tankerPiece: any;
        tankerPieceIndex: number;
    };
}

export interface UndoFuelSelectionAction extends Action {
    type: typeof UNDO_FUEL_SELECTION;
    payload: {
        aircraftPiece: any;
        aircraftPieceIndex: number;
    };
}

export interface MenuSelectAction extends Action {
    type: typeof MENU_SELECT;
    payload: {
        selectedMenuId: GameboardMetaState['selectedMenuId'];
    };
}

export interface NewsPopupToggleAction extends Action {
    type: typeof NEWSPOPUP_MINIMIZE_TOGGLE;
    payload: {};
}

export interface ShopPurchaseRequestAction extends Action {
    type: typeof SERVER_SHOP_PURCHASE_REQUEST;
    payload: {
        shopItemTypeId: ShopItemType['shopItemTypeId'];
    };
}
export interface ShopPurchaseAction extends Action {
    type: typeof SHOP_PURCHASE;
    payload: {
        shopItem: ShopItemType;
        points: number;
    };
}

export interface ShopRefundAction extends Action {
    type: typeof SHOP_REFUND;
    payload: {
        shopItemId: ShopItemType['shopItemId'];
        pointsAdded: number;
    };
}
export interface ShopRefundRequestAction extends Action {
    type: typeof SERVER_SHOP_REFUND_REQUEST;
    payload: {
        shopItem: ShopItemType;
    };
}

export interface ShopConfirmPurchaseRequestAction extends Action {
    type: typeof SERVER_SHOP_CONFIRM_PURCHASE;
}
export interface ShopConfirmPurchaseAction extends Action {
    type: typeof SHOP_TRANSFER;
    payload: {
        invItems: InvState;
    };
}

export interface InvItemPlaceRequestAction extends Action {
    type: typeof SERVER_PIECE_PLACE;
    payload: {
        invItemId: InvItemType['invItemId'];
        selectedPosition: number;
    };
}
export interface InvItemPlaceAction extends Action {
    type: typeof PIECE_PLACE;
    payload: {
        invItemId: InvItemType['invItemId'];
        positionId: number;
        newPiece: PieceType;
    };
}

export interface EnterContainerRequestAction extends Action {
    type: typeof SERVER_OUTER_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
}

export interface EnterContainerAction extends Action {
    type: typeof OUTER_PIECE_CLICK_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
}

export interface ExitContainerRequestAction extends Action {
    type: typeof SERVER_INNER_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
}

export interface PieceCloseAction extends Action {
    type: typeof PIECE_CLOSE_ACTION;
    payload: {
        selectedPiece: PieceType;
    };
}

export interface PieceOpenAction extends Action {
    type: typeof PIECE_OPEN_ACTION;
    payload: {
        selectedPiece: PieceType;
        gameboard: GameboardState;
    };
}

export interface PurchasePhaseAction extends Action {
    type: typeof PURCHASE_PHASE;
}

export interface CombatPhaseAction extends Action {
    type: typeof COMBAT_PHASE;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
    };
}

export interface EventBattleAction extends Action {
    type: typeof EVENT_BATTLE;
    payload: {
        friendlyPieces: BattleState['friendlyPieces'];
        enemyPieces: BattleState['enemyPieces'];
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
}

export interface EventRefuelAction extends Action {
    type: typeof EVENT_REFUEL;
    payload: {
        tankers: RefuelState['tankers'];
        aircraft: RefuelState['aircraft'];
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
}

export interface PlacePhaseAction extends Action {
    type: typeof PLACE_PHASE;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        confirmedRemoteSense: CapabilitiesState['confirmedRemoteSense'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
    };
}

export interface NewRoundAction extends Action {
    type: typeof NEW_ROUND;
    payload: {
        gameRound: GameInfoState['gameRound'];
        gameboardPieces: GameboardPiecesDataType;
        confirmedRemoteSense: CapabilitiesState['confirmedRemoteSense'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
    };
}

export interface NoMoreEventsAction extends Action {
    type: typeof NO_MORE_EVENTS;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
}

export interface NewsPhaseAction extends Action {
    type: typeof NEWS_PHASE;
    payload: {
        news: NewsState;
        gamePoints: GameInfoState['gamePoints'];
    };
}

export type GameboardPiecesDataType = { [positionIndex: number]: PieceType[] };

export interface SliceChangeAction extends Action {
    type: typeof SLICE_CHANGE;
    payload: {
        confirmedRods: CapabilitiesState['confirmedRods'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedInsurgencyPos: any;
        confirmedInsurgencyPieces: any;
        gameboardPieces: GameboardPiecesDataType;
    };
}

export interface ExitTransportContainerAction extends Action {
    type: typeof INNER_TRANSPORT_PIECE_CLICK_ACTION;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
}

export interface ExitContainerAction extends Action {
    type: typeof INNER_PIECE_CLICK_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
}

export interface ExitTransportContainerRequestAction extends Action {
    type: typeof SERVER_INNER_TRANSPORT_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
}

export interface MainButtonClickRequestAction extends Action {
    type: typeof SERVER_MAIN_BUTTON_CLICK;
}
export interface MainButtonClickAction extends Action {
    type: typeof MAIN_BUTTON_CLICK;
}

export interface DeletePlanRequestAction extends Action {
    type: typeof SERVER_DELETE_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
    };
}

export interface DeletePlanAction extends Action {
    type: typeof DELETE_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
    };
}

export interface ConfirmPlanRequestAction extends Action {
    type: typeof SERVER_CONFIRM_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
        plan: singlePlan[];
    };
}

// TODO: what are the different move types (right now only 'move' -> could remove this entirely but was preparing for different moves)
export type singlePlan = { type: string; positionId: number };

export interface ConfirmPlanAction extends Action {
    type: typeof PLAN_WAS_CONFIRMED;
    payload: {
        pieceId: PieceType['pieceId'];
        plan: singlePlan[];
    };
}

export interface ConfirmBattleSelectionRequestAction extends Action {
    type: typeof SERVER_CONFIRM_BATTLE_SELECTION;
    payload: {
        friendlyPieces: any;
    };
}

export interface GameInitialStateAction extends Action {
    type: typeof INITIAL_GAMESTATE;
    payload: {
        invItems: InvState;
        shopItems: ShopState;
        gameboardPieces: GameboardPiecesDataType;
        gameInfo: GameInfoState;
        capabilities: CapabilitiesState;
        planning: {
            confirmedPlans: PlanningState['confirmedPlans'];
        };
        // TODO: fix these to not be 'any'
        news?: any;
        battle?: any;
        refuel?: any;
    };
}

export interface UpdateFlagAction extends Action {
    type: typeof UPDATE_FLAGS;
    payload: {
        flag0: GameInfoState['flag0'];
        flag1: GameInfoState['flag1'];
        flag2: GameInfoState['flag2'];
        flag3: GameInfoState['flag3'];
        flag4: GameInfoState['flag4'];
        flag5: GameInfoState['flag5'];
        flag6: GameInfoState['flag6'];
        flag7: GameInfoState['flag7'];
        flag8: GameInfoState['flag8'];
        flag9: GameInfoState['flag9'];
        flag10: GameInfoState['flag10'];
        flag11: GameInfoState['flag11'];
        flag12: GameInfoState['flag12'];
    };
}

export interface BattleResultsAction extends Action {
    type: typeof BATTLE_FIGHT_RESULTS;
    payload: {
        masterRecord: BattleState['masterRecord'];
    };
}

export interface ConfirmFuelSelectionRequestAction extends Action {
    type: typeof SERVER_CONFIRM_FUEL_SELECTION;
    payload: {
        aircraft: RefuelState['aircraft'];
        tankers: RefuelState['tankers'];
    };
}

export interface FuelResultsAction extends Action {
    type: typeof REFUEL_RESULTS;
    payload: {
        fuelUpdates: any;
    };
}
