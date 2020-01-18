export type GameType = {
    gameId: number;
    gameSection: string;
    gameInstructor: string;

    gameAdminPassword: string;

    gameActive: number;

    gameBluePassword: string;
    gameRedPassword: string;

    gameBlueController0: number; // TODO: used as boolean, should be consistent with how these are used
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

    airfield0: number;
    airfield1: number;
    airfield2: number;
    airfield3: number;
    airfield4: number;
    airfield5: number;
    airfield6: number;
    airfield7: number;
    airfield8: number;
    airfield9: number;
};

export type ShopItemType = {
    shopItemId: number;
    shopItemGameId: number;
    shopItemTeamId: number;
    shopItemTypeId: number;
};

export type InvItemType = {
    invItemId: number;
    invItemGameId: number;
    invItemTeamId: number;
    invItemTypeId: number;
};

export type PieceType = {
    pieceId: number;
    pieceGameId: number;
    pieceTeamId: number;
    pieceTypeId: number;
    piecePositionId: number;
    pieceContainerId: number;
    pieceVisible: number;
    pieceMoves: number;
    pieceFuel: number;

    /**
     * This not directly stored in database, but contains child pieces
     */
    pieceContents?: { pieces: PieceType[] };

    /**
     * True = Stuck in place, False = Free to move/make plans
     */
    pieceDisabled?: boolean; // TODO: store in the database, don't calculate (store by storing the event id that is disabling it? (the one with longest rounds left? (could be multiple things....)))
};

export type PlanType = {
    planGameId: number;
    planTeamId: number;
    planPieceId: number;
    planMovementOrder: number;
    planPositionId: number;
    planSpecialFlag: number;
};

export type NewsType = {
    newsId: number;
    newsGameId: number;
    newsOrder: number;
    newsTitle: string;
    newsInfo: string;
};

export type EventQueueType = {
    eventId: number;
    eventGameId: number;
    eventTeamId: number;
    eventTypeId: number;
    eventPosA: number;
    eventPosB: number;
};

export type EventItemType = {
    eventId: number;
    eventPieceId: number;
    eventItemTarget: number;
};

export type RodsFromGodType = {
    rodsFromGodId: number;
    gameId: number;
    teamId: number;
    positionId: number;
};

export type RemoteSensingType = {
    remoteSensingId: number;
    gameId: number;
    teamId: number;
    positionId: number;
    roundsLeft: number;
};

export type InsurgencyType = {
    insurgencyId: number;
    gameId: number;
    teamId: number;
    positionId: number;
};

export type BiologicalWeaponsType = {
    biologicalweaponsId: number;
    gameId: number;
    teamId: number;
    positionId: number;
    roundsLeft: number;
    activated: number;
};

export type RaiseMoraleType = {
    raiseMoraleId: number;
    gameId: number;
    teamId: number;
    commanderType: number;
    roundsLeft: number;
};

export type CommInterruptType = {
    commInterruptId: number;
    gameId: number;
    teamId: number;
    positionId: number;
    roundsLeft: number;
    activated: number;
};

export type GoldenEyeType = {
    goldenEyeId: number;
    gameId: number;
    teamId: number;
    positionId: number; // TODO: make sure this number is always within the range
    roundsLeft: number;
};

export type GoldenEyePieceType = {
    goldenEyeId: number;
    pieceId: number;
};
