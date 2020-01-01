export type PieceType = {
    pieceId: number;
    pieceGameId: number;
    pieceTeamId: number;
    pieceTypeId: number;
    piecePositionId: number;
    pieceContainerId: number;
    pieceLanded: number;
    pieceVisible: number;
    pieceMoves: number;
    pieceFuel: number;

    pieceContents?: any;

    /**
     * True = Stuck in place, False = Free to move/make plans
     */
    pieceDisabled: boolean;
};

export type ShopItemType = {
    shopItemId: number;
    shopItemGameId: number;
    shopItemTeamId: number;
    shopItemTypeId: number;
};

export type PlanType = {
    planGameId: number;
    planTeamId: number;
    planPieceId: number;
    planMovementOrder: number;
    planPositionId: number;
    planSpecialFlag: number;
};

export type InvItemType = {
    invItemId: number;
    invItemGameId: number;
    invItemTeamId: number;
    invItemTypeId: number;
};

export type GameType = {
    gameId: number;
    gameSection: string;
    gameInstructor: string;

    gameAdminPassword: string;

    gameActive: number;

    gameBluePassword: string;
    gameRedPassword: string;

    gameBlueController0: number;
    gameBlueController1: number;
    gameBlueController2: number;
    gameBlueController3: number;
    gameBlueController4: number;
    gameRedController0: number;
    gameRedController1: number;
    gameRedController2: number;
    gameRedController3: number;
    gameRedController4: number;

    gameBlueStatus: number;
    gameRedStatus: number;

    gameBluePoints: number;
    gameRedPoints: number;

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
};

export type EventType = {
    eventId: number;
    eventGameId: number;
    eventTeamId: number;
    eventTypeId: number;
    eventPosA: number;
    eventPosB: number;
};
