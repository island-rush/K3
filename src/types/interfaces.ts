import { Action, AnyAction } from 'redux';
import { InvItemType, PieceType, ShopItemType } from './classes';
// prettier-ignore
import { AIRCRAFT_CLICK, BATTLEPOPUP_MINIMIZE_TOGGLE, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, CANCEL_PLAN, CLEAR_BATTLE, COMBAT_PHASE, DELETE_PLAN, ENEMY_PIECE_SELECT, EVENT_BATTLE, EVENT_REFUEL, HIGHLIGHT_POSITIONS, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, INNER_TRANSPORT_PIECE_CLICK_ACTION, MAIN_BUTTON_CLICK, MENU_SELECT, NEWSPOPUP_MINIMIZE_TOGGLE, NEWS_PHASE, NEW_ROUND, NO_MORE_EVENTS, OUTER_PIECE_CLICK_ACTION, PIECE_CLEAR_SELECTION, PIECE_CLICK, PIECE_CLOSE_ACTION, PIECE_OPEN_ACTION, PIECE_PLACE, PLACE_PHASE, PLANNING_SELECT, PLAN_WAS_CONFIRMED, POSITION_SELECT, PURCHASE_PHASE, REFUELPOPUP_MINIMIZE_TOGGLE, REFUEL_RESULTS, SERVER_CONFIRM_BATTLE_SELECTION, SERVER_CONFIRM_FUEL_SELECTION, SERVER_CONFIRM_PLAN, SERVER_DELETE_PLAN, SERVER_INNER_PIECE_CLICK, SERVER_INNER_TRANSPORT_PIECE_CLICK, SERVER_MAIN_BUTTON_CLICK, SERVER_OUTER_PIECE_CLICK, SERVER_PIECE_PLACE, SERVER_SHOP_CONFIRM_PURCHASE, SERVER_SHOP_PURCHASE_REQUEST, SERVER_SHOP_REFUND_REQUEST, SET_USERFEEDBACK, SHOP_PURCHASE, SHOP_REFUND, SHOP_TRANSFER, SLICE_CHANGE, START_PLAN, TANKER_CLICK, TARGET_PIECE_SELECT, UNDO_FUEL_SELECTION, UNDO_MOVE, UPDATE_FLAGS } from '../constants';

export type Section = string;

export type GameControllers = number[];

export type Instructor = string;

export type Password = string;

export type EmitType = (requestType: string, clientAction: AnyAction) => any;

export interface UserfeedbackAction extends Action {
    type: typeof SET_USERFEEDBACK;
    payload: {
        userFeedback: string;
    };
}

export interface PositionSelectAction extends Action {
    type: typeof POSITION_SELECT;
    payload: {
        selectedPositionId: number;
    };
}

export interface HighlightPositionsAction extends Action {
    type: typeof HIGHLIGHT_POSITIONS;
    payload: {
        highlightedPositions: any;
    };
}

export interface PlanningSelectAction extends Action {
    type: typeof PLANNING_SELECT;
    payload: {
        selectedPositionId: number;
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
        battle: any;
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
        selectedMenuId: number;
    };
}

export interface NewsPopupToggleAction extends Action {
    type: typeof NEWSPOPUP_MINIMIZE_TOGGLE;
    payload: {};
}

export interface ShopPurchaseRequestAction extends Action {
    type: typeof SERVER_SHOP_PURCHASE_REQUEST;
    payload: {
        shopItemTypeId: number;
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
        shopItemId: number;
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
        invItems: InvItemType[];
    };
}

export interface InvItemPlaceRequestAction extends Action {
    type: typeof SERVER_PIECE_PLACE;
    payload: {
        invItemId: number;
        selectedPosition: number;
    };
}
export interface InvItemPlaceAction extends Action {
    type: typeof PIECE_PLACE;
    payload: {
        invItemId: number;
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
        gameboard: any;
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
        friendlyPieces: any;
        enemyPieces: any;
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: any;
    };
}

export interface EventRefuelAction extends Action {
    type: typeof EVENT_REFUEL;
    payload: {
        tankers: any;
        aircraft: any;
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: any;
    };
}

export interface PlacePhaseAction extends Action {
    type: typeof PLACE_PHASE;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        confirmedRemoteSense: any;
        confirmedBioWeapons: any;
        confirmedRaiseMorale: any;
        confirmedCommInterrupt: any;
        confirmedGoldenEye: any;
    };
}

export interface NewRoundAction extends Action {
    type: typeof NEW_ROUND;
    payload: {
        gameRound: number;
        gameboardPieces: GameboardPiecesDataType;
        confirmedRemoteSense: any;
        confirmedBioWeapons: any;
        confirmedRaiseMorale: any;
        confirmedCommInterrupt: any;
        confirmedGoldenEye: any;
    };
}

export interface NoMoreEventsAction extends Action {
    type: typeof NO_MORE_EVENTS;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: any;
    };
}

export interface NewsPhaseAction extends Action {
    type: typeof NEWS_PHASE;
    payload: {
        news: any;
        gamePoints: number;
    };
}

export type GameboardPiecesDataType = { [positionIndex: number]: PieceType[] };

export interface SliceChangeAction extends Action {
    type: typeof SLICE_CHANGE;
    payload: {
        confirmedRods: any;
        confirmedBioWeapons: any;
        confirmedGoldenEye: any;
        confirmedCommInterrupt: any;
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
        selectedPositionId: number;
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
        pieceId: number;
    };
}

export interface DeletePlanAction extends Action {
    type: typeof DELETE_PLAN;
    payload: {
        pieceId: number;
    };
}

export interface ConfirmPlanRequestAction extends Action {
    type: typeof SERVER_CONFIRM_PLAN;
    payload: {
        pieceId: number;
        plan: any;
    };
}

export interface ConfirmPlanAction extends Action {
    type: typeof PLAN_WAS_CONFIRMED;
    payload: {
        pieceId: number;
        plan: any;
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
        invItems: InvItemType[];
        shopItems: ShopItemType[];
        gameboardPieces: GameboardPiecesDataType;
        gameInfo: any;
        gameboardMeta: any;
    };
}

export interface UpdateFlagAction extends Action {
    type: typeof UPDATE_FLAGS;
    payload: {
        flag0: number;
        flag1: number;
        flag2: number;
        flag3: number;
        flag4: number;
        flag5: number;
        flag6: number;
        flag7: number;
        flag8: number;
        flag9: number;
        flag10: number;
        flag11: number;
        flag12: number;
    };
}

export interface BattleResultsAction extends Action {
    type: typeof BATTLE_FIGHT_RESULTS;
    payload: {
        masterRecord: any;
    };
}

export interface ConfirmFuelSelectionRequestAction extends Action {
    type: typeof SERVER_CONFIRM_FUEL_SELECTION;
    payload: {
        aircraft: any;
        tankers: any;
    };
}

export interface FuelResultsAction extends Action {
    type: typeof REFUEL_RESULTS;
    payload: {
        fuelUpdates: any;
    };
}
