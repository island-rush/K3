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
    PIECE_PLACE
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

export type EmitType = (requestType: string, clientAction: AnyAction) => SocketIOClient.Socket;

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
