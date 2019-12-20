import { Action, AnyAction } from "redux";
import {
    SET_USERFEEDBACK,
    SERVER_SHOP_PURCHASE_REQUEST,
    SERVER_SHOP_REFUND_REQUEST,
    SERVER_SHOP_CONFIRM_PURCHASE,
    SHOP_PURCHASE,
    SHOP_REFUND,
    SHOP_TRANSFER,
    SERVER_PIECE_PLACE,
    PIECE_PLACE,
    SERVER_OUTER_PIECE_CLICK,
    OUTER_PIECE_CLICK_ACTION,
    SERVER_INNER_PIECE_CLICK,
    INNER_PIECE_CLICK_ACTION,
    SERVER_INNER_TRANSPORT_PIECE_CLICK,
    INNER_TRANSPORT_PIECE_CLICK_ACTION,
    SERVER_RODS_FROM_GOD_CONFIRM,
    RODS_FROM_GOD_SELECTED,
    SERVER_REMOTE_SENSING_CONFIRM,
    REMOTE_SENSING_SELECTED,
    SERVER_INSURGENCY_CONFIRM,
    INSURGENCY_SELECTED,
    SERVER_BIOLOGICAL_WEAPONS_CONFIRM,
    BIO_WEAPON_SELECTED,
    SERVER_RAISE_MORALE_CONFIRM,
    RAISE_MORALE_SELECTED,
    SERVER_COMM_INTERRUPT_CONFIRM,
    COMM_INTERRUP_SELECTED,
    SERVER_GOLDEN_EYE_CONFIRM,
    GOLDEN_EYE_SELECTED,
    DELETE_PLAN,
    SERVER_DELETE_PLAN
} from "../redux/actions/actionTypes";

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
