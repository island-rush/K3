// prettier-ignore
import { AIRCRAFT_CLICK, BATTLEPOPUP_MINIMIZE_TOGGLE, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, CANCEL_PLAN, CLEAR_BATTLE, COMBAT_PHASE, DELETE_PLAN, DRONE_SWARM_HIT_NOTIFICATION, DRONE_SWARM_NOTIFY_CLEAR, ENEMY_PIECE_SELECT, EVENT_BATTLE, EVENT_REFUEL, HIGHLIGHT_POSITIONS, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, INNER_TRANSPORT_PIECE_CLICK_ACTION, MAIN_BUTTON_CLICK, MENU_SELECT, NEWSPOPUP_MINIMIZE_TOGGLE, NEWS_PHASE, NEW_ROUND, NO_MORE_EVENTS, OUTER_PIECE_CLICK_ACTION, PIECE_CLEAR_SELECTION, PIECE_CLICK, PIECE_CLOSE_ACTION, PIECE_OPEN_ACTION, PIECE_PLACE, PLACE_PHASE, PLANNING_SELECT, PLAN_WAS_CONFIRMED, POSITION_SELECT, PURCHASE_PHASE, REFUELPOPUP_MINIMIZE_TOGGLE, REFUEL_RESULTS, SEA_MINE_HIT_NOTIFICATION, SEA_MINE_NOTIFY_CLEAR, SERVER_CONFIRM_BATTLE_SELECTION, SERVER_CONFIRM_FUEL_SELECTION, SERVER_CONFIRM_PLAN, SERVER_DELETE_PLAN, SERVER_INNER_PIECE_CLICK, SERVER_INNER_TRANSPORT_PIECE_CLICK, SERVER_MAIN_BUTTON_CLICK, SERVER_OUTER_PIECE_CLICK, SERVER_PIECE_PLACE, SERVER_SHOP_CONFIRM_PURCHASE, SERVER_SHOP_PURCHASE_REQUEST, SERVER_SHOP_REFUND_REQUEST, SET_USERFEEDBACK, SHOP_PURCHASE, SHOP_REFUND, SHOP_TRANSFER, SLICE_CHANGE, START_PLAN, TANKER_CLICK, TARGET_PIECE_SELECT, UNDO_FUEL_SELECTION, UNDO_MOVE, UPDATE_AIRFIELDS, UPDATE_FLAGS } from '../constants';
import { InvItemType, PieceType, ShopItemType } from './databaseTables';
// prettier-ignore
import { BattleState, CapabilitiesState, GameboardMetaState, GameboardState, GameInfoState, InvState, NewsState, PlanningState, RefuelState, ShopState, UserfeedbackState } from './reducerTypes';

export type UserfeedbackAction = {
    type: typeof SET_USERFEEDBACK;
    payload: {
        userFeedback: UserfeedbackState;
    };
};

export type PositionSelectAction = {
    type: typeof POSITION_SELECT;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export type HighlightPositionsAction = {
    type: typeof HIGHLIGHT_POSITIONS;
    payload: {
        highlightedPositions: GameboardMetaState['highlightedPositions'];
    };
};

export type PlanningSelectAction = {
    type: typeof PLANNING_SELECT;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export type PieceClickAction = {
    type: typeof PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
    };
};

export type PieceClearAction = {
    type: typeof PIECE_CLEAR_SELECTION;
    payload: {};
};

export type RefuelPopupToggleAction = {
    type: typeof REFUELPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export type UndoMoveAction = {
    type: typeof UNDO_MOVE;
    payload: {};
};

export type PreventPlanAction = {
    type: typeof CANCEL_PLAN;
    payload: {};
};

export type BattlePopupToggleAction = {
    type: typeof BATTLEPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export type BattlePieceSelectAction = {
    type: typeof BATTLE_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export type ClearBattleAction = {
    type: typeof CLEAR_BATTLE;
    payload: {
        battle: BattleState;
    };
};

export type EnemyPieceSelectAction = {
    type: typeof ENEMY_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export type TargetPieceClickAction = {
    type: typeof TARGET_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export type StartPlanAction = {
    type: typeof START_PLAN;
    payload: {};
};

export type AircraftClickAction = {
    type: typeof AIRCRAFT_CLICK;
    payload: {
        aircraftPiece: any;
        aircraftPieceIndex: number;
    };
};

export type TankerClickAction = {
    type: typeof TANKER_CLICK;
    payload: {
        tankerPiece: any;
        tankerPieceIndex: number;
    };
};

export type UndoFuelSelectionAction = {
    type: typeof UNDO_FUEL_SELECTION;
    payload: {
        aircraftPiece: any;
        aircraftPieceIndex: number;
    };
};

export type MenuSelectAction = {
    type: typeof MENU_SELECT;
    payload: {
        selectedMenuId: GameboardMetaState['selectedMenuId'];
    };
};

export type NewsPopupToggleAction = {
    type: typeof NEWSPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export type ShopPurchaseRequestAction = {
    type: typeof SERVER_SHOP_PURCHASE_REQUEST;
    payload: {
        shopItemTypeId: ShopItemType['shopItemTypeId'];
    };
};
export type ShopPurchaseAction = {
    type: typeof SHOP_PURCHASE;
    payload: {
        shopItem: ShopItemType;
        points: GameInfoState['gamePoints'];
    };
};

export type ShopRefundAction = {
    type: typeof SHOP_REFUND;
    payload: {
        shopItemId: ShopItemType['shopItemId'];
        pointsAdded: GameInfoState['gamePoints'];
    };
};
export type ShopRefundRequestAction = {
    type: typeof SERVER_SHOP_REFUND_REQUEST;
    payload: {
        shopItem: ShopItemType;
    };
};

export type ShopConfirmPurchaseRequestAction = {
    type: typeof SERVER_SHOP_CONFIRM_PURCHASE;
};
export type ShopConfirmPurchaseAction = {
    type: typeof SHOP_TRANSFER;
    payload: {
        invItems: InvState;
    };
};

export type InvItemPlaceRequestAction = {
    type: typeof SERVER_PIECE_PLACE;
    payload: {
        invItemId: InvItemType['invItemId'];
        selectedPosition: number;
    };
};
export type InvItemPlaceAction = {
    type: typeof PIECE_PLACE;
    payload: {
        invItemId: InvItemType['invItemId'];
        positionId: number;
        newPiece: PieceType;
    };
};

export type EnterContainerRequestAction = {
    type: typeof SERVER_OUTER_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export type EnterContainerAction = {
    type: typeof OUTER_PIECE_CLICK_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export type ExitContainerRequestAction = {
    type: typeof SERVER_INNER_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export type PieceCloseAction = {
    type: typeof PIECE_CLOSE_ACTION;
    payload: {
        selectedPiece: PieceType;
    };
};

export type PieceOpenAction = {
    type: typeof PIECE_OPEN_ACTION;
    payload: {
        selectedPiece: PieceType;
        gameboard: GameboardState;
    };
};

export type PurchasePhaseAction = {
    type: typeof PURCHASE_PHASE;
};

export type CombatPhaseAction = {
    type: typeof COMBAT_PHASE;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
    };
};

export type EventBattleAction = {
    type: typeof EVENT_BATTLE;
    payload: {
        friendlyPieces: BattleState['friendlyPieces'];
        enemyPieces: BattleState['enemyPieces'];
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
};

export type EventRefuelAction = {
    type: typeof EVENT_REFUEL;
    payload: {
        tankers: RefuelState['tankers'];
        aircraft: RefuelState['aircraft'];
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
};

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
    };
};

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
    };
};

export type NoMoreEventsAction = {
    type: typeof NO_MORE_EVENTS;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
};

export type NewsPhaseAction = {
    type: typeof NEWS_PHASE;
    payload: {
        news: NewsState;
        gamePoints: GameInfoState['gamePoints'];
    };
};

export type GameboardPiecesDataType = { [positionIndex: number]: PieceType[] };

export type SliceChangeAction = {
    type: typeof SLICE_CHANGE;
    payload: {
        confirmedRods: CapabilitiesState['confirmedRods'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
        confirmedNukes: CapabilitiesState['confirmedNukes'];
        confirmedInsurgencyPos: any;
        confirmedInsurgencyPieces: any;
        gameboardPieces: GameboardPiecesDataType;
    };
};

export type ExitTransportContainerAction = {
    type: typeof INNER_TRANSPORT_PIECE_CLICK_ACTION;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export type ExitContainerAction = {
    type: typeof INNER_PIECE_CLICK_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export type ExitTransportContainerRequestAction = {
    type: typeof SERVER_INNER_TRANSPORT_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export type MainButtonClickRequestAction = {
    type: typeof SERVER_MAIN_BUTTON_CLICK;
};
export type MainButtonClickAction = {
    type: typeof MAIN_BUTTON_CLICK;
};

export type DeletePlanRequestAction = {
    type: typeof SERVER_DELETE_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
    };
};

export type DeletePlanAction = {
    type: typeof DELETE_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
    };
};

export type ConfirmPlanRequestAction = {
    type: typeof SERVER_CONFIRM_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
        plan: singlePlan[];
    };
};

// TODO: what are the different move types (right now only 'move' -> could remove this entirely but was preparing for different moves)
export type singlePlan = { type: string; positionId: number };

export type ConfirmPlanAction = {
    type: typeof PLAN_WAS_CONFIRMED;
    payload: {
        pieceId: PieceType['pieceId'];
        plan: singlePlan[];
    };
};

export type ConfirmBattleSelectionRequestAction = {
    type: typeof SERVER_CONFIRM_BATTLE_SELECTION;
    payload: {
        friendlyPieces: any;
    };
};

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
        // TODO: fix these to not be 'any'
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

export type SeaMineHitNotifyAction = {
    type: typeof SEA_MINE_HIT_NOTIFICATION;
    payload: {
        positionsToHighlight: number[];
    };
};

export type ClearSeaMineNotifyAction = {
    type: typeof SEA_MINE_NOTIFY_CLEAR;
    payload: {};
};

export type DroneSwarmHitNotifyAction = {
    type: typeof DRONE_SWARM_HIT_NOTIFICATION;
    payload: {
        positionsToHighlight: number[];
    };
};

export type ClearDroneSwarmMineNotifyAction = {
    type: typeof DRONE_SWARM_NOTIFY_CLEAR;
    payload: {};
};

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

export type BattleResultsAction = {
    type: typeof BATTLE_FIGHT_RESULTS;
    payload: {
        masterRecord: BattleState['masterRecord'];
    };
};

export type ConfirmFuelSelectionRequestAction = {
    type: typeof SERVER_CONFIRM_FUEL_SELECTION;
    payload: {
        aircraft: RefuelState['aircraft'];
        tankers: RefuelState['tankers'];
    };
};

export type FuelResultsAction = {
    type: typeof REFUEL_RESULTS;
    payload: {
        fuelUpdates: {
            pieceId: PieceType['pieceId'];
            piecePositionId: PieceType['piecePositionId'];
            newFuel: number;
        }[];
    };
};
