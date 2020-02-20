// prettier-ignore
import { AIRFIELD_TYPE, FLAG_TYPE, GAME_INFO_MENU_INDEX, INV_MENU_INDEX, LAND_TYPE, LIST_ALL_POSITIONS_TYPE, MISSILE_SILO_TYPE, NEUTRAL_TEAM_ID, NO_MENU_INDEX, SHOP_MENU_INDEX, SPACE_MENU_INDEX, WATER_TYPE } from '../constants';
import { GameType, InvItemType, NewsType, PieceType, ShopItemType } from './databaseTables';
import { GameSession } from './sessionTypes';
import { MasterRecordType } from './battles';

export type ShopState = ShopItemType[];

export type InvState = InvItemType[];

export type UserfeedbackState = string;

export type positionType = typeof LAND_TYPE | typeof AIRFIELD_TYPE | typeof WATER_TYPE | typeof FLAG_TYPE | typeof MISSILE_SILO_TYPE;
export type GameboardPositionType = { type: positionType; pieces: PieceType[] };
export type GameboardState = GameboardPositionType[];

export type GameInfoState = {
    gameSection: GameType['gameSection'];
    gameInstructor: GameType['gameInstructor'];
    gameTeam: GameSession['gameTeam'] | typeof NEUTRAL_TEAM_ID;
    gameControllers: GameSession['gameControllers'];
    gamePhase: GameType['gamePhase'];
    gameRound: GameType['gameRound'];
    gameSlice: GameType['gameSlice'];
    gameStatus: GameType['gameBlueStatus'];
    gamePoints: GameType['gameBluePoints'];
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
    airfield0: GameType['airfield0'];
    airfield1: GameType['airfield1'];
    airfield2: GameType['airfield2'];
    airfield3: GameType['airfield3'];
    airfield4: GameType['airfield4'];
    airfield5: GameType['airfield5'];
    airfield6: GameType['airfield6'];
    airfield7: GameType['airfield7'];
    airfield8: GameType['airfield8'];
    airfield9: GameType['airfield9'];
    [key: string]: any;
};

export type MenuIndexType =
    | typeof NO_MENU_INDEX
    | typeof SHOP_MENU_INDEX
    | typeof INV_MENU_INDEX
    | typeof SPACE_MENU_INDEX
    | typeof GAME_INFO_MENU_INDEX;

export type GameboardMetaState = {
    /**
     * Position most recently clicked by player. -1 => stop selecting positions.
     */
    selectedPosition: LIST_ALL_POSITIONS_TYPE;

    /**
     * List of positions to highlight on the board.
     */
    highlightedPositions: number[];

    /**
     * Piece most recently clicked by the user.
     */
    selectedPiece: PieceType | null;

    /**
     * Id of menu that should be open.
     */
    selectedMenuId: MenuIndexType;
};

export type CapabilitiesState = {
    /**
     * List of positions that were hit by rods from god.
     */
    confirmedRods: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of center positions for remote sensing active.
     */
    confirmedRemoteSense: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of positions that were hit by insurgency.
     */
    confirmedInsurgency: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of positions that were hit by biological weapons.
     */
    confirmedBioWeapons: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of boosts for commander types, listed as commander type numbers
     * ex: [3, 3, 4] => 2 move boost for type 3 commander, 1 move boost for type 4 commander
     */
    confirmedRaiseMorale: number[];

    /**
     * List of center positions getting comm interrupted.
     */
    confirmedCommInterrupt: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of positions hit by golden eye.
     */
    confirmedGoldenEye: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of positions with a sea mine in it.
     */
    confirmedSeaMines: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of positions that had a sea mine successfully hit something.
     */
    seaMineHits: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of positions with drone swarms in them.
     */
    confirmedDroneSwarms: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of positions that had a drone swarm successfully hit something.
     */
    droneSwarmHits: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of positions with an atc scramble active on it.
     */
    confirmedAtcScramble: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of center positions for nukes.
     */
    confirmedNukes: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of confirmed plans for missile attack(s) against enemy piece(s).
     */
    confirmedMissileAttacks: { missileId: number; targetId: number }[];

    /**
     * List of positions that had a piece get hit by missile attack.
     */
    confirmedMissileHitPos: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of confirmed plans for bombardment attack(s) against enemy pieces(s).
     */
    confirmedBombardments: { destroyerId: number; targetId: number }[];

    /**
     * List of positions that had a piece get hit by bombardment.
     */
    confirmedBombardmentHitPos: LIST_ALL_POSITIONS_TYPE[];

    /**
     * Each number in this array is an antisat, and the number represents number of rounds left.
     */
    confirmedAntiSat: number[];

    /**
     * List of positions that were the center positions for a remote sensing, to show that it was taken out.
     */
    confirmedAntiSatHitPos: LIST_ALL_POSITIONS_TYPE[]; // TODO: there's a lot of weird timing situations with keeping track of positions (of remote sensing) hit if multiple used rapidly

    /**
     * Contains list of missile pieceId's that are currently disrupted.
     */
    confirmedMissileDisrupts: PieceType['pieceId'][];

    /**
     * Indicates if this team has a cyber defense currently in effect.
     */
    isCyberDefenseActive: boolean;

    /**
     * List of positions that had a piece get hit by a sam's auto fire.
     */
    samHitPos: LIST_ALL_POSITIONS_TYPE[];
};

export type PlanningState = {
    isActive: boolean;
    isSelectingCommander: boolean;

    /**
     * If the player is planning to use a capability.
     */
    isUsingCapability: boolean;

    /**
     * If the player is selecting a position to place a piece on, null if not, invItem if selecting
     */
    placementSelecting: InvItemType | null;

    /**
     * Contains the missile piece that was selected to use.
     */
    missileSelecting: PieceType | null;

    /**
     * Contains the destroyer piece that was selected to use.
     */
    bombardmentSelecting: PieceType | null;

    /**
     * Contains the inv item (capability) that was selected to use.
     */
    invItem: InvItemType | null;

    /**
     * List of adjacent positions, in order, to be visited.
     */
    moves: LIST_ALL_POSITIONS_TYPE[];

    /**
     * List of all piece plans.
     */
    confirmedPlans: { [pieceId: number]: LIST_ALL_POSITIONS_TYPE[] };
};

export type ContainerState = {
    isActive: boolean;
    isSelectingHex: boolean;
    innerPieceToDrop: PieceType | null;
    containerPiece: PieceType | null;
    outerPieces: PieceType[];
};

// TODO: possibly put within ./types/battle
export type BattlePieceStateType = {
    piece: {
        pieceId: PieceType['pieceId'];
        pieceTypeId: PieceType['pieceTypeId'];
        piecePositionId: PieceType['piecePositionId'];
    };
    targetPiece?: {
        pieceId: PieceType['pieceId'];
        pieceTypeId: PieceType['pieceTypeId'];
        piecePositionId: PieceType['piecePositionId'];
    };
    targetPieceIndex?: number;
    win?: boolean;
    diceRoll1?: 1 | 2 | 3 | 4 | 5 | 6;
    diceRoll2?: 1 | 2 | 3 | 4 | 5 | 6;
};
export type BattleState = {
    isActive: boolean;
    isMinimized: boolean;
    selectedBattlePiece: any;
    selectedBattlePieceIndex: number; // helper to find the piece within the array
    masterRecord: MasterRecordType | null;
    friendlyPieces: BattlePieceStateType[];
    enemyPieces: BattlePieceStateType[];
};

export type NewsState = {
    isActive: boolean;
    isMinimized: boolean;
    newsTitle: NewsType['newsTitle'];
    newsInfo: NewsType['newsInfo'];
};

export type RefuelState = {
    isActive: boolean;
    selectedTankerPieceId: PieceType['pieceId'];
    selectedTankerPieceIndex: number;
    tankers: (PieceType & {
        removedFuel?: number;
    })[]; // Client is adding some stuff (fuel selections)
    aircraft: (PieceType & {
        tankerPieceId?: number;
        tankerPieceIndex?: number;
    })[];
};
