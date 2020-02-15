import { LIST_ALL_POSITIONS_TYPE } from '../constants';
import { InvItemType, PieceType, ShopItemType } from './databaseTables';
// prettier-ignore
import { BattleState, CapabilitiesState, GameboardMetaState, GameboardState, GameInfoState, InvState, NewsState, PlanningState, RefuelState, ShopState, UserfeedbackState } from './reducerTypes';

export type GameboardPiecesDataType = { [positionIndex: number]: PieceType[] };

export const INITIAL_GAMESTATE = 'INITIAL_GAMESTATE';
export type GameInitialStateAction = {
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
        news?: {
            newsTitle: NewsState['newsTitle'];
            newsInfo: NewsState['newsInfo'];
        };
        battle?: {
            friendlyPieces: BattleState['friendlyPieces'];
            enemyPieces: BattleState['enemyPieces'];
        };
        refuel?: {
            tankers: RefuelState['tankers'];
            aircraft: RefuelState['aircraft'];
        };
    };
};

export const MENU_SELECT = 'MENU_SELECT';
export type MenuSelectAction = {
    type: typeof MENU_SELECT;
    payload: {
        selectedMenuId: GameboardMetaState['selectedMenuId'];
    };
};

export const PIECE_CLICK = 'PIECE_CLICK';
export type PieceClickAction = {
    type: typeof PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
    };
};

export const PIECE_CLEAR_SELECTION = 'PIECE_CLEAR_SELECTION';
export type PieceClearAction = {
    type: typeof PIECE_CLEAR_SELECTION;
    payload: {};
};

export const MAIN_BUTTON_CLICK = 'MAIN_BUTTON_CLICK';
export type MainButtonClickAction = {
    type: typeof MAIN_BUTTON_CLICK;
};

export const SERVER_MAIN_BUTTON_CLICK = 'SERVER_MAIN_BUTTON_CLICK';
export type MainButtonClickRequestAction = {
    type: typeof SERVER_MAIN_BUTTON_CLICK;
};

export const START_PLAN = 'START_PLAN';
export type StartPlanAction = {
    type: typeof START_PLAN;
    payload: {};
};

export const CANCEL_PLAN = 'CANCEL_PLAN';
export type PreventPlanAction = {
    type: typeof CANCEL_PLAN;
    payload: {};
};

export const SERVER_CONFIRM_PLAN = 'SERVER_CONFIRM_PLAN';
export type ConfirmPlanRequestAction = {
    type: typeof SERVER_CONFIRM_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
        plan: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const PLANNING_SELECT = 'PLANNING_SELECT';
export type PlanningSelectAction = {
    type: typeof PLANNING_SELECT;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const PLAN_WAS_CONFIRMED = 'PLAN_WAS_CONFIRMED';
export type ConfirmPlanAction = {
    type: typeof PLAN_WAS_CONFIRMED;
    payload: {
        pieceId: PieceType['pieceId'];
        plan: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const DELETE_PLAN = 'DELETE_PLAN';
export type DeletePlanAction = {
    type: typeof DELETE_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
    };
};

export const SERVER_DELETE_PLAN = 'SERVER_DELETE_PLAN';
export type DeletePlanRequestAction = {
    type: typeof SERVER_DELETE_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
    };
};

export const UNDO_MOVE = 'UNDO_MOVE';
export type UndoMoveAction = {
    type: typeof UNDO_MOVE;
    payload: {};
};

export const NEWS_PHASE = 'NEWS_PHASE';
export type NewsPhaseAction = {
    type: typeof NEWS_PHASE;
    payload: {
        news: NewsState;
        gamePoints: GameInfoState['gamePoints'];
    };
};

export const NEWSPOPUP_MINIMIZE_TOGGLE = 'NEWSPOPUP_MINIMIZE_TOGGLE';
export type NewsPopupToggleAction = {
    type: typeof NEWSPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export const PURCHASE_PHASE = 'PURCHASE_PHASE';
export type PurchasePhaseAction = {
    type: typeof PURCHASE_PHASE;
};

export const SET_USERFEEDBACK = 'SET_USERFEEDBACK';
export type UserfeedbackAction = {
    type: typeof SET_USERFEEDBACK;
    payload: {
        userFeedback: UserfeedbackState;
    };
};

export const POSITION_SELECT = 'POSITION_SELECT';
export type PositionSelectAction = {
    type: typeof POSITION_SELECT;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const HIGHLIGHT_POSITIONS = 'HIGHLIGHT_POSITIONS';
export type HighlightPositionsAction = {
    type: typeof HIGHLIGHT_POSITIONS;
    payload: {
        highlightedPositions: GameboardMetaState['highlightedPositions'];
    };
};

export const SHOP_PURCHASE = 'SHOP_PURCHASE';
export type ShopPurchaseAction = {
    type: typeof SHOP_PURCHASE;
    payload: {
        shopItem: ShopItemType;
        points: GameInfoState['gamePoints'];
    };
};

export const SHOP_REFUND = 'SHOP_REFUND';
export type ShopRefundAction = {
    type: typeof SHOP_REFUND;
    payload: {
        shopItemId: ShopItemType['shopItemId'];
        pointsAdded: GameInfoState['gamePoints'];
    };
};

export const SHOP_TRANSFER = 'SHOP_TRANSFER';
export type ShopConfirmPurchaseAction = {
    type: typeof SHOP_TRANSFER;
    payload: {
        invItems: InvState;
    };
};

export const COMBAT_PHASE = 'COMBAT_PHASE';
export type CombatPhaseAction = {
    type: typeof COMBAT_PHASE;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
    };
};

export const NEW_ROUND = 'NEW_ROUND';
export type NewRoundAction = {
    type: typeof NEW_ROUND;
    payload: {
        gameRound: GameInfoState['gameRound'];
        gameboardPieces: GameboardPiecesDataType;
        confirmedRemoteSense: CapabilitiesState['confirmedRemoteSense'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
        confirmedSeaMines: CapabilitiesState['confirmedSeaMines'];
        confirmedDroneSwarms: CapabilitiesState['confirmedDroneSwarms'];
        confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
        confirmedNukes: CapabilitiesState['confirmedNukes'];
        confirmedAntiSat: CapabilitiesState['confirmedAntiSat'];
        confirmedMissileDisrupts: CapabilitiesState['confirmedMissileDisrupts'];
        cyberDefenseIsActive: CapabilitiesState['isCyberDefenseActive'];
    };
};

export const SLICE_CHANGE = 'SLICE_CHANGE';
export type SliceChangeAction = {
    type: typeof SLICE_CHANGE;
    payload: {
        confirmedRods: CapabilitiesState['confirmedRods'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
        confirmedMissileDisrupts: CapabilitiesState['confirmedMissileDisrupts'];
        confirmedNukes: CapabilitiesState['confirmedNukes'];
        confirmedMissileHitPos: CapabilitiesState['confirmedMissileHitPos'];
        confirmedBombardmentHitPos: CapabilitiesState['confirmedBombardmentHitPos'];
        confirmedInsurgencyPos: LIST_ALL_POSITIONS_TYPE[];
        confirmedInsurgencyPieces: PieceType[];
        gameboardPieces: GameboardPiecesDataType;
    };
};

export const PLACE_PHASE = 'PLACE_PHASE';
export type PlacePhaseAction = {
    type: typeof PLACE_PHASE;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        confirmedRemoteSense: CapabilitiesState['confirmedRemoteSense'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
        confirmedSeaMines: CapabilitiesState['confirmedSeaMines'];
        confirmedDroneSwarms: CapabilitiesState['confirmedDroneSwarms'];
        confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
        confirmedNukes: CapabilitiesState['confirmedNukes'];
        confirmedAntiSat: CapabilitiesState['confirmedAntiSat'];
        confirmedMissileDisrupts: CapabilitiesState['confirmedMissileDisrupts'];
        cyberDefenseIsActive: CapabilitiesState['isCyberDefenseActive'];
    };
};

export const PIECE_PLACE_START = 'PIECE_PLACE_START';
export type PiecePlaceStartAction = {
    type: typeof PIECE_PLACE_START;
    payload: {
        invItem: InvItemType;
    };
};

export const BATTLEPOPUP_MINIMIZE_TOGGLE = 'BATTLEPOPUP_MINIMIZE_TOGGLE';
export type BattlePopupToggleAction = {
    type: typeof BATTLEPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export const BATTLE_PIECE_SELECT = 'BATTLE_PIECE_SELECT';
export type BattlePieceSelectAction = {
    type: typeof BATTLE_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export const TARGET_PIECE_SELECT = 'TARGET_PIECE_SELECT';
export type TargetPieceClickAction = {
    type: typeof TARGET_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export const ENEMY_PIECE_SELECT = 'ENEMY_PIECE_SELECT';
export type EnemyPieceSelectAction = {
    type: typeof ENEMY_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export const EVENT_BATTLE = 'EVENT_BATTLE';
export type EventBattleAction = {
    type: typeof EVENT_BATTLE;
    payload: {
        friendlyPieces: BattleState['friendlyPieces'];
        enemyPieces: BattleState['enemyPieces'];
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
};

export const BATTLE_FIGHT_RESULTS = 'BATTLE_FIGHT_RESULTS';
export type BattleResultsAction = {
    type: typeof BATTLE_FIGHT_RESULTS;
    payload: {
        masterRecord: BattleState['masterRecord'];
    };
};

export const BATTLE_SELECTIONS = 'BATTLE_SELECTIONS';
export type BattleSelectionsAction = {
    type: typeof BATTLE_SELECTIONS;
    payload: {
        friendlyPieces: BattleState['friendlyPieces'];
        enemyPieces: BattleState['enemyPieces'];
    };
};

export const CLEAR_BATTLE = 'CLEAR_BATTLE';
export type ClearBattleAction = {
    type: typeof CLEAR_BATTLE;
    payload: {
        battle: BattleState;
    };
};

export const NO_MORE_BATTLES = 'NO_MORE_BATTLES';
export type NoMoreBattlesAction = {
    type: typeof NO_MORE_BATTLES;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
};

export const UPDATE_FLAGS = 'UPDATE_FLAGS';
export type UpdateFlagAction = {
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
};

export const UPDATE_AIRFIELDS = 'UPDATE_AIRFIELDS';
export type UpdateAirfieldAction = {
    type: typeof UPDATE_AIRFIELDS;
    payload: {
        airfield0: GameInfoState['airfield0'];
        airfield1: GameInfoState['airfield1'];
        airfield2: GameInfoState['airfield2'];
        airfield3: GameInfoState['airfield3'];
        airfield4: GameInfoState['airfield4'];
        airfield5: GameInfoState['airfield5'];
        airfield6: GameInfoState['airfield6'];
        airfield7: GameInfoState['airfield7'];
        airfield8: GameInfoState['airfield8'];
        airfield9: GameInfoState['airfield9'];
    };
};

export const REFUEL_OPEN = 'REFUEL_OPEN';
export type RefuelOpenAction = {
    type: typeof REFUEL_OPEN;
    payload: {
        aircraft: PieceType[];
        tankers: PieceType[];
    };
};

export const UNDO_FUEL_SELECTION = 'UNDO_FUEL_SELECTION';
export type UndoFuelSelectionAction = {
    type: typeof UNDO_FUEL_SELECTION;
    payload: {
        aircraftPiece: any;
        aircraftPieceIndex: number;
    };
};

export const REFUEL_RESULTS = 'REFUEL_RESULTS';
export type FuelResultsAction = {
    type: typeof REFUEL_RESULTS;
    payload: {
        fuelUpdates: {
            pieceId: PieceType['pieceId'];
            piecePositionId: PieceType['piecePositionId'];
            newFuel: PieceType['pieceFuel'];
        }[];
    };
};

export const REFUELPOPUP_MINIMIZE_TOGGLE = 'REFUELPOPUP_MINIMIZE_TOGGLE';
export type RefuelPopupToggleAction = {
    type: typeof REFUELPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export const TANKER_CLICK = 'TANKER_CLICK';
export type TankerClickAction = {
    type: typeof TANKER_CLICK;
    payload: {
        tankerPiece: any;
        tankerPieceIndex: number;
    };
};

export const AIRCRAFT_CLICK = 'AIRCRAFT_CLICK';
export type AircraftClickAction = {
    type: typeof AIRCRAFT_CLICK;
    payload: {
        aircraftPiece: any;
        aircraftPieceIndex: number;
    };
};

export const PIECE_OPEN_ACTION = 'PIECE_OPEN_ACTION';
export type PieceOpenAction = {
    type: typeof PIECE_OPEN_ACTION;
    payload: {
        selectedPiece: PieceType;
        gameboard: GameboardState;
    };
};

export const PIECE_CLOSE_ACTION = 'PIECE_CLOSE_ACTION';
export type PieceCloseAction = {
    type: typeof PIECE_CLOSE_ACTION;
    payload: {
        selectedPiece: PieceType;
    };
};

export const INNER_PIECE_CLICK_ACTION = 'INNER_PIECE_CLICK_ACTION';
export type ExitContainerAction = {
    type: typeof INNER_PIECE_CLICK_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const OUTER_PIECE_CLICK_ACTION = 'OUTER_PIECE_CLICK_ACTION';
export type EnterContainerAction = {
    type: typeof OUTER_PIECE_CLICK_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const INNER_TRANSPORT_PIECE_CLICK_ACTION = 'INNER_TRANSPORT_PIECE_CLICK_ACTION';
export type ExitTransportContainerAction = {
    type: typeof INNER_TRANSPORT_PIECE_CLICK_ACTION;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const SEA_MINE_HIT_NOTIFICATION = 'SEA_MINE_HIT_NOTIFICATION';
export type SeaMineHitNotifyAction = {
    type: typeof SEA_MINE_HIT_NOTIFICATION;
    payload: {
        positionsToHighlight: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const SEA_MINE_NOTIFY_CLEAR = 'SEA_MINE_NOTIFY_CLEAR';
export type ClearSeaMineNotifyAction = {
    type: typeof SEA_MINE_NOTIFY_CLEAR;
    payload: {};
};

export const SAM_DELETED_PIECES = 'SAM_DELETED_PIECES';
export type SamDeletedPiecesAction = {
    type: typeof SAM_DELETED_PIECES;
    payload: {
        listOfDeletedPieces: PieceType[];
    };
};

export const CLEAR_SAM_DELETE = 'CLEAR_SAM_DELETE';
export type ClearSamDeleteAction = {
    type: typeof CLEAR_SAM_DELETE;
    payload: {
        listOfDeletedPieces: PieceType[];
    };
};

export const DRONE_SWARM_HIT_NOTIFICATION = 'DRONE_SWARM_HIT_NOTIFICATION';
export type DroneSwarmHitNotifyAction = {
    type: typeof DRONE_SWARM_HIT_NOTIFICATION;
    payload: {
        positionsToHighlight: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const DRONE_SWARM_NOTIFY_CLEAR = 'DRONE_SWARM_NOTIFY_CLEAR';
export type ClearDroneSwarmMineNotifyAction = {
    type: typeof DRONE_SWARM_NOTIFY_CLEAR;
    payload: {};
};

export const SERVER_SHOP_PURCHASE_REQUEST = 'SERVER_SHOP_PURCHASE_REQUEST';
export type ShopPurchaseRequestAction = {
    type: typeof SERVER_SHOP_PURCHASE_REQUEST;
    payload: {
        shopItemTypeId: ShopItemType['shopItemTypeId'];
    };
};

export const SERVER_SHOP_REFUND_REQUEST = 'SERVER_SHOP_REFUND_REQUEST';
export type ShopRefundRequestAction = {
    type: typeof SERVER_SHOP_REFUND_REQUEST;
    payload: {
        shopItem: ShopItemType;
    };
};

export const SERVER_SHOP_CONFIRM_PURCHASE = 'SERVER_SHOP_CONFIRM_PURCHASE';
export type ShopConfirmPurchaseRequestAction = {
    type: typeof SERVER_SHOP_CONFIRM_PURCHASE;
};

export const SERVER_PIECE_PLACE = 'SERVER_PIECE_PLACE';
export type InvItemPlaceRequestAction = {
    type: typeof SERVER_PIECE_PLACE;
    payload: {
        invItemId: InvItemType['invItemId'];
        selectedPosition: PieceType['piecePositionId'];
    };
};

export const SERVER_CONFIRM_BATTLE_SELECTION = 'SERVER_CONFIRM_BATTLE_SELECTION';
export type ConfirmBattleSelectionRequestAction = {
    type: typeof SERVER_CONFIRM_BATTLE_SELECTION;
    payload: {
        friendlyPieces: any;
    };
};

export const SERVER_CONFIRM_FUEL_SELECTION = 'SERVER_CONFIRM_FUEL_SELECTION';
export type ConfirmFuelSelectionRequestAction = {
    type: typeof SERVER_CONFIRM_FUEL_SELECTION;
    payload: {
        aircraft: RefuelState['aircraft'];
        tankers: RefuelState['tankers'];
    };
};

export const SERVER_INNER_PIECE_CLICK = 'SERVER_INNER_PIECE_CLICK';
export type ExitContainerRequestAction = {
    type: typeof SERVER_INNER_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const SERVER_INNER_TRANSPORT_PIECE_CLICK = 'SERVER_INNER_TRANSPORT_PIECE_CLICK';
export type ExitTransportContainerRequestAction = {
    type: typeof SERVER_INNER_TRANSPORT_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const SERVER_OUTER_PIECE_CLICK = 'SERVER_OUTER_PIECE_CLICK';
export type EnterContainerRequestAction = {
    type: typeof SERVER_OUTER_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const PIECE_PLACE = 'PIECE_PLACE';
export type InvItemPlaceAction = {
    type: typeof PIECE_PLACE;
    payload: {
        invItem: InvItemType;
        positionId: PieceType['piecePositionId'];
        newPiece: PieceType;
    };
};
