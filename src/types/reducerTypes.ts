import { AIRFIELD_TYPE, FLAG_TYPE, LAND_TYPE, MISSILE_SILO_TYPE, WATER_TYPE } from '../constants';
import { EventItemType, GameType, InvItemType, NewsType, PieceType, ShopItemType } from './databaseTables';
import { GameSession } from './sessionTypes';

export type ShopState = ShopItemType[];

export type InvState = InvItemType[];

export type UserfeedbackState = string;

type positionType = typeof LAND_TYPE | typeof AIRFIELD_TYPE | typeof WATER_TYPE | typeof FLAG_TYPE | typeof MISSILE_SILO_TYPE;
export type GameboardState = { type: positionType; pieces: PieceType[] }[];

export type GameInfoState = {
    gameSection: GameType['gameSection'];
    gameInstructor: GameType['gameInstructor'];
    gameTeam: GameSession['gameTeam'];
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
};
export type GameboardMetaState = {
    /**
     * Position most recently clicked by player. -1 => stop selecting positions.
     */
    selectedPosition: number;

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
    selectedMenuId: number;
};

export type CapabilitiesState = {
    /**
     * List of positions that were hit by rods from god.
     */
    confirmedRods: number[];

    /**
     * List of center positions for remote sensing active.
     */
    confirmedRemoteSense: number[];

    /**
     * List of positions that were hit by insurgency.
     */
    confirmedInsurgency: number[];

    /**
     * List of positions that were hit by biological weapons.
     */
    confirmedBioWeapons: number[];

    /**
     * List of boosts for commander types, listed as commander type numbers
     * ex: [3, 3, 4] => 2 move boost for type 3 commander, 1 move boost for type 4 commander
     */
    confirmedRaiseMorale: number[];

    /**
     * List of center positions getting comm interrupted.
     */
    confirmedCommInterrupt: number[];

    /**
     * List of positions hit by golden eye.
     */
    confirmedGoldenEye: number[];

    /**
     * List of positions with a sea mine in it.
     */
    confirmedSeaMines: number[];

    /**
     * List of positions that had a sea mine successfully hit something.
     */
    seaMineHits: number[];

    /**
     * List of positions with drone swarms in them.
     */
    confirmedDroneSwarms: number[];

    /**
     * List of positions that had a drone swarm successfully hit something.
     */
    droneSwarmHits: number[];

    /**
     * List of positions with an atc scramble active on it.
     */
    confirmedAtcScramble: number[];

    /**
     * List of center positions for nukes.
     */
    confirmedNukes: number[];

    /**
     * List of confirmed plans for missile attack(s) against enemy piece(s).
     */
    confirmedMissileAttacks: { missileId: number; targetId: number }[];

    /**
     * List of positions that had a piece get hit by missile attack.
     */
    confirmedMissileHitPos: number[];

    /**
     * List of confirmed plans for bombardment attack(s) against enemy pieces(s).
     */
    confirmedBombardments: { destroyerId: number; targetId: number }[];

    /**
     * List of positions that had a piece get hit by bombardment.
     */
    confirmedBombardmentHitPos: number[];

    /**
     * Each number in this array is an antisat, and the number represents number of rounds left.
     */
    confirmedAntiSat: number[];

    /**
     * List of positions that were the center positions for a remote sensing, to show that it was taken out.
     */
    confirmedAntiSatHitPos: number[]; // TODO: there's a lot of weird timing situations with keeping track of positions (of remote sensing) hit if multiple used rapidly

    /**
     * Contains list of missile pieceId's that are currently disrupted.
     */
    confirmedMissileDisrupts: number[];

    /**
     * Indicates if this team has a cyber defense currently in effect.
     */
    cyberDefenseIsActive: boolean;

    /**
     * List of positions that had a piece get hit by a sam's auto fire.
     */
    samHitPos: number[];
};

export type PlanningState = {
    active: boolean;
    raiseMoralePopupActive: boolean;

    /**
     * If the player is planning to use a capability.
     */
    capability: boolean;

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
    moves: number[];

    /**
     * List of all piece plans.
     */
    confirmedPlans: { [pieceId: number]: number[] };
};

export type ContainerState = {
    active: boolean;
    isSelectingHex: boolean;
    innerPieceToDrop: PieceType | null;
    containerPiece: PieceType | null;
    outerPieces: PieceType[];
};

export type BattleState = {
    isMinimized: boolean;
    active: boolean;
    selectedBattlePiece: any;
    selectedBattlePieceIndex: number; // helper to find the piece within the array
    masterRecord: any | null;
    friendlyPieces: {
        // TODO: refactor this without question marks
        piece: PieceType;
        targetPiece: PieceType | null;
        targetPieceIndex?: number;
        diceRoll?: any;
        win?: any;
        diceRoll1?: any;
        diceRoll2?: any;
    }[];
    enemyPieces: {
        targetPiece: any | null;
        targetPieceIndex: number;
        piece: any;
        diceRoll?: any;
        win?: any;
        diceRoll1?: any;
        diceRoll2?: any;
    }[];
};

export type NewsState = {
    isMinimized: boolean;
    active: boolean;
    newsTitle: NewsType['newsTitle'];
    newsInfo: NewsType['newsInfo'];
};

export type RefuelState = {
    isMinimized: boolean;
    active: boolean;
    selectedTankerPieceId: number;
    selectedTankerPieceIndex: number;
    tankers: (EventItemType &
        PieceType & {
            removedFuel?: number;
        })[]; // Client is adding some stuff (fuel selections)
    aircraft: (EventItemType &
        PieceType & {
            tankerPieceId?: number;
            tankerPieceIndex?: number;
        })[];
};
