// prettier-ignore
import { ACTIVATED, BLUE_TEAM_ID, COL_BATTLE_EVENT_TYPE, COMBAT_PHASE_ID, DEACTIVATED, LIST_ALL_TYPES_ENUM, LOGGED_IN_VALUE, NEUTRAL_TEAM_ID, NEWS_PHASE_ID, NOT_LOGGED_IN_VALUE, NOT_WAITING_STATUS, PLACE_PHASE_ID, POS_BATTLE_EVENT_TYPE, PURCHASE_PHASE_ID, RED_TEAM_ID, REFUEL_EVENT_TYPE, SLICE_EXECUTING_ID, SLICE_PLANNING_ID, WAITING_STATUS } from '../constants';
import { ControllerType } from './sessionTypes';

export type GameType = {
    gameId: number;
    gameSection: string;
    gameInstructor: string;

    gameAdminPassword: string;

    gameActive: typeof ACTIVATED | typeof DEACTIVATED;

    gameBluePassword: string;
    gameRedPassword: string;

    gameBlueController0: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE; // TODO: used as boolean, should be consistent with how these are used
    gameBlueController1: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;
    gameBlueController2: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;
    gameBlueController3: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;
    gameBlueController4: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;
    gameRedController0: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;
    gameRedController1: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;
    gameRedController2: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;
    gameRedController3: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;
    gameRedController4: typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;

    gameBlueStatus: typeof WAITING_STATUS | typeof NOT_WAITING_STATUS;
    gameRedStatus: typeof WAITING_STATUS | typeof NOT_WAITING_STATUS;

    gameBluePoints: number;
    gameRedPoints: number;

    gamePhase: typeof NEWS_PHASE_ID | typeof PURCHASE_PHASE_ID | typeof COMBAT_PHASE_ID | typeof PLACE_PHASE_ID;
    gameRound: number;
    gameSlice: typeof SLICE_PLANNING_ID | typeof SLICE_EXECUTING_ID;

    flag0: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag1: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag2: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag3: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag4: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag5: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag6: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag7: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag8: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag9: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag10: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag11: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    flag12: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;

    airfield0: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield1: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield2: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield3: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield4: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield5: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield6: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield7: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield8: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
    airfield9: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID | typeof NEUTRAL_TEAM_ID;
};

export type ShopItemType = {
    shopItemId: number;
    shopItemGameId: GameType['gameId'];
    shopItemTeamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    shopItemTypeId: LIST_ALL_TYPES_ENUM;
};

export type InvItemType = {
    invItemId: number;
    invItemGameId: GameType['gameId'];
    invItemTeamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    invItemTypeId: LIST_ALL_TYPES_ENUM;
};

export type PieceType = {
    pieceId: number;
    pieceGameId: GameType['gameId'];
    pieceTeamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    pieceTypeId: LIST_ALL_TYPES_ENUM;
    piecePositionId: number;
    pieceContainerId: PieceType['pieceId'];
    pieceVisible: 0 | 1; // TODO: constant for this
    pieceMoves: number;
    pieceFuel: number;

    /**
     * This not directly stored in database, but contains child pieces
     */
    pieceContents?: { pieces: PieceType[] };

    /**
     * True = Stuck in place, False = Free to move/make plans
     */
    isPieceDisabled?: boolean; // TODO: store in the database, don't calculate (store by storing the event id that is disabling it? (the one with longest rounds left? (could be multiple things....)))
};

export type PlanType = {
    planGameId: GameType['gameId'];
    planTeamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    planPieceId: PieceType['pieceId'];
    planMovementOrder: number;
    planPositionId: number;
};

export type NewsType = {
    newsId: number;
    newsGameId: GameType['gameId'];
    newsOrder: number;
    newsTitle: string;
    newsInfo: string;
};

export type EventQueueType = {
    eventId: number;
    eventGameId: GameType['gameId'];
    eventTeamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    eventTypeId: typeof POS_BATTLE_EVENT_TYPE | typeof COL_BATTLE_EVENT_TYPE | typeof REFUEL_EVENT_TYPE;
    eventPosA: number;
    eventPosB: number;
};

export type EventItemType = {
    eventId: EventQueueType['eventId'];
    eventPieceId: PieceType['pieceId'];
    eventItemTarget: PieceType['pieceId'];
};

export type RodsFromGodType = {
    rodsFromGodId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number;
};

export type RemoteSensingType = {
    remoteSensingId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number;
    roundsLeft: number;
};

export type InsurgencyType = {
    insurgencyId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number;
};

export type BiologicalWeaponsType = {
    biologicalweaponsId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number; // TODO: create enum for list of all possible positions
    roundsLeft: number;
    activated: typeof ACTIVATED | typeof DEACTIVATED;
};

export type RaiseMoraleType = {
    raiseMoraleId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    commanderType: ControllerType;
    roundsLeft: number;
};

export type CommInterruptType = {
    commInterruptId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number;
    roundsLeft: number;
    activated: typeof ACTIVATED | typeof DEACTIVATED;
};

export type GoldenEyeType = {
    goldenEyeId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number;
    roundsLeft: number;
    activated: typeof ACTIVATED | typeof DEACTIVATED;
};

export type GoldenEyePieceType = {
    goldenEyeId: number;
    pieceId: PieceType['pieceId'];
};

export type SeaMineType = {
    seaMineId: number;
    gameId: GameType['gameId'];
    gameTeam: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number;
};

export type DroneSwarmType = {
    droneSwarmId: number;
    gameId: GameType['gameId'];
    gameTeam: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number;
    roundsLeft: number;
};

export type AtcScrambleType = {
    atcScrambleId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number; // TODO: could even do enum for sub position lists
    roundsLeft: number;
    activated: typeof ACTIVATED | typeof DEACTIVATED;
};

export type NukeType = {
    nukeId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    positionId: number;
    activated: typeof ACTIVATED | typeof DEACTIVATED;
};

export type MissileAttackType = {
    missileAttackId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    missileId: PieceType['pieceId'];
    targetId: PieceType['pieceId'];
};

export type BombardmentType = {
    bombardmentId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    destroyerId: PieceType['pieceId'];
    targetId: PieceType['pieceId'];
};

export type AntiSatMissileType = {
    antiSatId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    roundsLeft: number;
};

export type MissileDisruptType = {
    missileDisruptId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    missileId: PieceType['pieceId'];
    roundsLeft: number;
    activated: typeof ACTIVATED | typeof DEACTIVATED;
};

export type CyberDefenseType = {
    cyberDefenseId: number;
    gameId: GameType['gameId'];
    teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
    roundsLeft: number;
};
