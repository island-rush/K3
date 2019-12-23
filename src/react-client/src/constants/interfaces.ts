import { Action, AnyAction } from 'redux';
//prettier-ignore
import { AIRCRAFT_CLICK, BATTLEPOPUP_MINIMIZE_TOGGLE, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, BIO_WEAPON_SELECTED, BIO_WEAPON_SELECTING, CANCEL_PLAN, CLEAR_BATTLE, COMBAT_PHASE, COMM_INTERRUPT_SELECTING, COMM_INTERRUP_SELECTED, DELETE_PLAN, ENEMY_PIECE_SELECT, EVENT_BATTLE, EVENT_REFUEL, GOLDEN_EYE_SELECTED, GOLDEN_EYE_SELECTING, HIGHLIGHT_POSITIONS, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, INNER_TRANSPORT_PIECE_CLICK_ACTION, INSURGENCY_SELECTED, INSURGENCY_SELECTING, MAIN_BUTTON_CLICK, MENU_SELECT, NEWSPOPUP_MINIMIZE_TOGGLE, NEWS_PHASE, NEW_ROUND, NO_MORE_EVENTS, OUTER_PIECE_CLICK_ACTION, PIECE_CLEAR_SELECTION, PIECE_CLICK, PIECE_CLOSE_ACTION, PIECE_OPEN_ACTION, PIECE_PLACE, PLACE_PHASE, PLANNING_SELECT, PLAN_WAS_CONFIRMED, POSITION_SELECT, PURCHASE_PHASE, RAISE_MORALE_SELECTED, RAISE_MORALE_SELECTING, REFUELPOPUP_MINIMIZE_TOGGLE, REFUEL_RESULTS, REMOTE_SENSING_SELECTED, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTED, RODS_FROM_GOD_SELECTING, SERVER_BIOLOGICAL_WEAPONS_CONFIRM, SERVER_COMM_INTERRUPT_CONFIRM, SERVER_CONFIRM_BATTLE_SELECTION, SERVER_CONFIRM_FUEL_SELECTION, SERVER_CONFIRM_PLAN, SERVER_DELETE_PLAN, SERVER_GOLDEN_EYE_CONFIRM, SERVER_INNER_PIECE_CLICK, SERVER_INNER_TRANSPORT_PIECE_CLICK, SERVER_INSURGENCY_CONFIRM, SERVER_MAIN_BUTTON_CLICK, SERVER_OUTER_PIECE_CLICK, SERVER_PIECE_PLACE, SERVER_RAISE_MORALE_CONFIRM, SERVER_REMOTE_SENSING_CONFIRM, SERVER_RODS_FROM_GOD_CONFIRM, SERVER_SHOP_CONFIRM_PURCHASE, SERVER_SHOP_PURCHASE_REQUEST, SERVER_SHOP_REFUND_REQUEST, SET_USERFEEDBACK, SHOP_PURCHASE, SHOP_REFUND, SHOP_TRANSFER, SLICE_CHANGE, START_PLAN, TANKER_CLICK, TARGET_PIECE_SELECT, UNDO_FUEL_SELECTION, UNDO_MOVE, UPDATE_FLAGS } from "../redux/actions/actionTypes";

/**
 * Section for Instructor's Game
 *
 * Ex: 'm1a1'
 */
export type Section = string;

/**
 * All the controller types that this user can act as are stored in this array.
 */
export type GameControllers = number[];

/**
 * Lastname of Instructor
 */
export type Instructor = string;

/**
 * Password (plaintext)
 */
export type Password = string;

export type EmitType = (requestType: string, clientAction: AnyAction) => any;

export interface UserfeedbackAction extends Action {
    type: typeof SET_USERFEEDBACK;
    payload: {
        userFeedback: string;
    };
}

export interface GameInfoState {
    gameSection: GameType['gameSection'];
    gameInstructor: GameType['gameInstructor'];
    gameTeam: GameSession['gameTeam'];
    gameControllers: GameSession['gameControllers'];
    gamePhase: GameType['gamePhase'];
    gameRound: GameType['gameRound'];
    gameSlice: GameType['gameSlice'];
    gameStatus: GameType['game0Status'];
    gamePoints: GameType['game0Points'];
    flag0: GameType['flag0'];
    flag1: GameType['flag1'];
    flag2: GameType['flag2'];
    flag3: GameType['flag3'];
    flag4: GameType['flag4'];
    flag5: GameType['flag5'];
    flag6: GameType['flag6'];
    flag7: GameType['flag7'];
    flag8: GameType['flag8'];
    flag9: GameType['flag9'];
    flag10: GameType['flag10'];
    flag11: GameType['flag11'];
    flag12: GameType['flag12'];
}

export interface GameboardMetaState {
    selectedPosition: number;
    highlightedPositions: number[];
    selectedPiece: PieceType | null;
    selectedMenuId: number;
    news: {
        isMinimized: boolean;
        active: boolean;
        newsTitle: string;
        newsInfo: string;
    };
    battle: {
        isMinimized: boolean;
        active: boolean;
        selectedBattlePiece: any;
        selectedBattlePieceIndex: number;
        masterRecord: any;
        friendlyPieces: any[];
        enemyPieces: any[];
    };
    refuel: {
        isMinimized: boolean,
        active: boolean,
        selectedTankerPieceId: number;
        selectedTankerPieceIndex: number;
        tankers: any;
        aircraft: any;
    };
    container: {
        active: boolean;
        isSelectingHex: boolean;
        innerPieceToDrop: any;
        containerPiece: any;
        outerPieces: any[];
    };
    planning: {
        active: boolean;
        capability: boolean;
        raiseMoralePopupActive: boolean;
        invItem: any;
        moves: any[];
    };
    confirmedPlans: any;
    confirmedRods: any[];
    confirmedRemoteSense: any[];
    confirmedInsurgency: any[];
    confirmedBioWeapons: any[];
    confirmedRaiseMorale: any[];
    confirmedCommInterrupt: any[];
    confirmedGoldenEye: any[];
}

export interface ShopState {
    [index: number]: ShopItemType;
}
export interface InvState {
    [index: number]: InvItemType;
}
export interface GameboardState {
    [index: number]: {
        type: string;
        pieces: PieceType[]
    }
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

export interface RemoteSenseSelectingAction extends Action {
    type: typeof REMOTE_SENSING_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface RaiseMoraleSelectingAction extends Action {
    type: typeof RAISE_MORALE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
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

export interface BioWeaponSelectingAction extends Action {
    type: typeof BIO_WEAPON_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface CommInterruptSelectingAction extends Action {
    type: typeof COMM_INTERRUPT_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface GoldenEyeSelectingAction extends Action {
    type: typeof GOLDEN_EYE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface InsurgencySelectingAction extends Action {
    type: typeof INSURGENCY_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface RodsFromGodSelectingAction extends Action {
    type: typeof RODS_FROM_GOD_SELECTING;
    payload: {
        invItem: InvItemType;
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
        gameboardPieces: any;
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
        gameboardPieces: any;
    };
}

export interface EventBattleAction extends Action {
    type: typeof EVENT_BATTLE;
    payload: {
        friendlyPieces: any;
        enemyPieces: any;
        gameboardPieces: any;
        gameStatus: any;
    };
}

export interface EventRefuelAction extends Action {
    type: typeof EVENT_REFUEL;
    payload: {
        tankers: any;
        aircraft: any;
        gameboardPieces: any;
        gameStatus: any;
    };
}

export interface PlacePhaseAction extends Action {
    type: typeof PLACE_PHASE;
    payload: {
        gameboardPieces: any;
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
        gameboardPieces: any;
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
        gameboardPieces: any;
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

export interface SliceChangeAction extends Action {
    type: typeof SLICE_CHANGE;
    payload: {
        confirmedRods: any;
        confirmedBioWeapons: any;
        confirmedGoldenEye: any;
        confirmedCommInterrupt: any;
        confirmedInsurgencyPos: any;
        confirmedInsurgencyPieces: any;
        gameboardPieces: any;
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
        gameboardPieces: any;
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

export interface RodsFromGodRequestAction extends Action {
    type: typeof SERVER_RODS_FROM_GOD_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface RodsFromGodAction extends Action {
    type: typeof RODS_FROM_GOD_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: number;
    };
}

export interface RemoteSensingRequestAction extends Action {
    type: typeof SERVER_REMOTE_SENSING_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface RemoteSensingAction extends Action {
    type: typeof REMOTE_SENSING_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRemoteSense: any;
        gameboardPieces: any;
    };
}

export interface MainButtonClickRequestAction extends Action {
    type: typeof SERVER_MAIN_BUTTON_CLICK;
}
export interface MainButtonClickAction extends Action {
    type: typeof MAIN_BUTTON_CLICK;
}

export interface InsurgencyRequestAction extends Action {
    type: typeof SERVER_INSURGENCY_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface InsurgencyAction extends Action {
    type: typeof INSURGENCY_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: number;
    };
}

export interface BioWeaponsRequestAction extends Action {
    type: typeof SERVER_BIOLOGICAL_WEAPONS_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface BioWeaponsAction extends Action {
    type: typeof BIO_WEAPON_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: number;
    };
}

export interface RaiseMoraleRequestAction extends Action {
    type: typeof SERVER_RAISE_MORALE_CONFIRM;
    payload: {
        selectedCommanderType: number;
        invItem: InvItemType;
    };
}

export interface RaiseMoraleAction extends Action {
    type: typeof RAISE_MORALE_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRaiseMorale: any;
        gameboardPieces: any;
    };
}

export interface CommInterruptRequestAction extends Action {
    type: typeof SERVER_COMM_INTERRUPT_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface CommInterruptAction extends Action {
    type: typeof COMM_INTERRUP_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedCommInterrupt: any;
    };
}

export interface GoldenEyeRequestAction extends Action {
    type: typeof SERVER_GOLDEN_EYE_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface GoldenEyeAction extends Action {
    type: typeof GOLDEN_EYE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: number;
    };
}

export type PositionCapabilityRequestAction =
    | RodsFromGodRequestAction
    | RemoteSensingRequestAction
    | InsurgencyRequestAction
    | BioWeaponsRequestAction
    | CommInterruptRequestAction
    | GoldenEyeRequestAction;

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
        gameboardPieces: any;
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

/**
 * This object stored within session.ir3 to tie users to game, team, and controller(s)
 */
export interface GameSession {
    gameId: number;

    /**
     * Indicates Blue or Red Team (0 / 1)
     */
    gameTeam: number;

    gameControllers: number[];
}

/**
 * This object stored within session.ir3teacher to tie user to game as teacher.
 */
export interface TeacherSession {
    gameId: number;

    /**
     *
     */
    gameSection: string;
    gameInstructor: string;
}

export interface PieceType {
    pieceId: number;
    pieceGameId: number;
    pieceTeamId: number;
    pieceTypeId: number;
    piecePositionId: number;
    pieceContainerId: number;
    pieceVisible: number;
    pieceMoves: number;
    pieceFuel: number;

    pieceContents?: any;

    /**
     * True = Stuck in place, False = Free to move/make plans
     *
     * @type {boolean}
     * @memberof PieceType
     */
    pieceDisabled: boolean;
}

export interface ShopItemType {
    shopItemId: number;
    shopItemGameId: number;
    shopItemTeamId: number;
    shopItemTypeId: number;
}

export interface PlanType {
    planGameId: number;
    planTeamId: number;
    planPieceId: number;
    planMovementOrder: number;
    planPositionId: number;
    planSpecialFlag: number;
}

export interface InvItemType {
    invItemId: number;
    invItemGameId: number;
    invItemTeamId: number;
    invItemTypeId: number;
}

export interface GameType {
    gameId: number;
    gameSection: string;
    gameInstructor: string;

    gameAdminPassword: string;

    gameActive: number;

    game0Password: string;
    game1Password: string;

    game0Controller0: number;
    game0Controller1: number;
    game0Controller2: number;
    game0Controller3: number;
    game0Controller4: number;
    game1Controller0: number;
    game1Controller1: number;
    game1Controller2: number;
    game1Controller3: number;
    game1Controller4: number;

    game0Status: number;
    game1Status: number;

    game0Points: number;
    game1Points: number;

    gamePhase: number;
    gameRound: number;
    gameSlice: number;

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
}

export interface EventType {
    eventId: number;
    eventGameId: number;
    eventTeamId: number;
    eventTypeId: number;
    eventPosA: number;
    eventPosB: number;
}
