// prettier-ignore
import { ACTIVATED, BLUE_TEAM_ID, COL_BATTLE_EVENT_TYPE, COMBAT_PHASE_ID, DEACTIVATED, LIST_ALL_POSITIONS_TYPE, LIST_ALL_TYPES_ENUM, LOGGED_IN_VALUE, NEUTRAL_TEAM_ID, NEWS_PHASE_ID, NOT_LOGGED_IN_VALUE, NOT_WAITING_STATUS, PLACE_PHASE_ID, POS_BATTLE_EVENT_TYPE, PURCHASE_PHASE_ID, RED_TEAM_ID, REFUEL_EVENT_TYPE, SLICE_EXECUTING_ID, SLICE_PLANNING_ID, WAITING_STATUS } from '../constants';
import { ControllerType } from './sessionTypes';

export type BlueOrRedTeamId = typeof BLUE_TEAM_ID | typeof RED_TEAM_ID;
export type BlueRedNeutralTypes = BlueOrRedTeamId | typeof NEUTRAL_TEAM_ID;

export type ActivatedTypes = typeof ACTIVATED | typeof DEACTIVATED;
export type LoggedInValueTypes = typeof LOGGED_IN_VALUE | typeof NOT_LOGGED_IN_VALUE;

export type StatusTypes = typeof WAITING_STATUS | typeof NOT_WAITING_STATUS;

export type PhaseTypes = typeof NEWS_PHASE_ID | typeof PURCHASE_PHASE_ID | typeof COMBAT_PHASE_ID | typeof PLACE_PHASE_ID;
export type SliceTypes = typeof SLICE_EXECUTING_ID | typeof SLICE_PLANNING_ID;

export type GameType = {
    gameId: number;
    gameSection: string;
    gameInstructor: string;

    gameAdminPassword: string;

    gameActive: ActivatedTypes;

    gameBluePassword: string;
    gameRedPassword: string;

    gameBlueController0: LoggedInValueTypes; // TODO: used as boolean, should be consistent with how these are used
    gameBlueController1: LoggedInValueTypes;
    gameBlueController2: LoggedInValueTypes;
    gameBlueController3: LoggedInValueTypes;
    gameBlueController4: LoggedInValueTypes;
    gameRedController0: LoggedInValueTypes;
    gameRedController1: LoggedInValueTypes;
    gameRedController2: LoggedInValueTypes;
    gameRedController3: LoggedInValueTypes;
    gameRedController4: LoggedInValueTypes;

    gameBlueStatus: StatusTypes;
    gameRedStatus: StatusTypes;

    gameBluePoints: number;
    gameRedPoints: number;

    gamePhase: PhaseTypes;
    gameRound: number;
    gameSlice: SliceTypes;

    flag0: BlueRedNeutralTypes;
    flag1: BlueRedNeutralTypes;
    flag2: BlueRedNeutralTypes;
    flag3: BlueRedNeutralTypes;
    flag4: BlueRedNeutralTypes;
    flag5: BlueRedNeutralTypes;
    flag6: BlueRedNeutralTypes;
    flag7: BlueRedNeutralTypes;
    flag8: BlueRedNeutralTypes;
    flag9: BlueRedNeutralTypes;
    flag10: BlueRedNeutralTypes;
    flag11: BlueRedNeutralTypes;
    flag12: BlueRedNeutralTypes;

    airfield0: BlueRedNeutralTypes;
    airfield1: BlueRedNeutralTypes;
    airfield2: BlueRedNeutralTypes;
    airfield3: BlueRedNeutralTypes;
    airfield4: BlueRedNeutralTypes;
    airfield5: BlueRedNeutralTypes;
    airfield6: BlueRedNeutralTypes;
    airfield7: BlueRedNeutralTypes;
    airfield8: BlueRedNeutralTypes;
    airfield9: BlueRedNeutralTypes;
};

export type ShopItemType = {
    shopItemId: number;
    shopItemGameId: GameType['gameId'];
    shopItemTeamId: BlueOrRedTeamId;
    shopItemTypeId: LIST_ALL_TYPES_ENUM;
};

export type InvItemType = {
    invItemId: number;
    invItemGameId: GameType['gameId'];
    invItemTeamId: BlueOrRedTeamId;
    invItemTypeId: LIST_ALL_TYPES_ENUM;
};

export type PieceVisibleTypes = 0 | 1; // TODO: constant for this

export type PieceType = {
    pieceId: number;
    pieceGameId: GameType['gameId'];
    pieceTeamId: BlueOrRedTeamId;
    pieceTypeId: LIST_ALL_TYPES_ENUM;
    piecePositionId: LIST_ALL_POSITIONS_TYPE;
    pieceContainerId: PieceType['pieceId'];
    pieceVisible: PieceVisibleTypes;
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
    planTeamId: BlueOrRedTeamId;
    planPieceId: PieceType['pieceId'];
    planMovementOrder: number;
    planPositionId: LIST_ALL_POSITIONS_TYPE;
};

export type NewsType = {
    newsId: number;
    newsGameId: GameType['gameId'];
    newsOrder: number;
    newsTitle: string;
    newsInfo: string;
};

export type EventTypes = typeof POS_BATTLE_EVENT_TYPE | typeof COL_BATTLE_EVENT_TYPE | typeof REFUEL_EVENT_TYPE;

export type EventQueueType = {
    eventId: number;
    eventGameId: GameType['gameId'];
    eventTeamId: BlueOrRedTeamId;
    eventTypeId: EventTypes;
    eventPosA: LIST_ALL_POSITIONS_TYPE;
    eventPosB: LIST_ALL_POSITIONS_TYPE;
};

export type EventItemType = {
    eventId: EventQueueType['eventId'];
    eventPieceId: PieceType['pieceId'];
    eventItemTarget: PieceType['pieceId'];
};

export type RodsFromGodType = {
    rodsFromGodId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
};

export type RemoteSensingType = {
    remoteSensingId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
    roundsLeft: number;
};

export type InsurgencyType = {
    insurgencyId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
};

export type BiologicalWeaponsType = {
    biologicalweaponsId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
    roundsLeft: number;
    activated: ActivatedTypes;
};

export type RaiseMoraleType = {
    raiseMoraleId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    commanderType: ControllerType;
    roundsLeft: number;
};

export type CommInterruptType = {
    commInterruptId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
    roundsLeft: number;
    activated: ActivatedTypes;
};

export type GoldenEyeType = {
    goldenEyeId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
    roundsLeft: number;
    activated: ActivatedTypes;
};

export type GoldenEyePieceType = {
    goldenEyeId: number;
    pieceId: PieceType['pieceId'];
};

export type SeaMineType = {
    seaMineId: number;
    gameId: GameType['gameId'];
    gameTeam: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
};

export type DroneSwarmType = {
    droneSwarmId: number;
    gameId: GameType['gameId'];
    gameTeam: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
    roundsLeft: number;
};

export type AtcScrambleType = {
    atcScrambleId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE; // TODO: could even do enum for sub position lists
    roundsLeft: number;
    activated: ActivatedTypes;
};

export type NukeType = {
    nukeId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    positionId: LIST_ALL_POSITIONS_TYPE;
    activated: ActivatedTypes;
};

export type MissileAttackType = {
    missileAttackId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    missileId: PieceType['pieceId'];
    targetId: PieceType['pieceId'];
};

export type BombardmentType = {
    bombardmentId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    destroyerId: PieceType['pieceId'];
    targetId: PieceType['pieceId'];
};

export type AntiSatMissileType = {
    antiSatId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    roundsLeft: number;
};

export type MissileDisruptType = {
    missileDisruptId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    missileId: PieceType['pieceId'];
    roundsLeft: number;
    activated: ActivatedTypes;
};

export type CyberDefenseType = {
    cyberDefenseId: number;
    gameId: GameType['gameId'];
    teamId: BlueOrRedTeamId;
    roundsLeft: number;
};
