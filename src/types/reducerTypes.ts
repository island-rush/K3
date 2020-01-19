import { AIRFIELD_TYPE, FLAG_TYPE, LAND_TYPE, MISSILE_SILO_TYPE, WATER_TYPE } from '../constants';
import { GameType, InvItemType, PieceType, ShopItemType, NewsType, EventItemType } from './databaseTables';
import { singlePlan } from './actionTypes';
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
    selectedPosition: number;
    highlightedPositions: number[];
    selectedPiece: PieceType | null;
    selectedMenuId: number;
};

export type CapabilitiesState = {
    confirmedRods: number[];
    confirmedRemoteSense: number[];
    confirmedInsurgency: number[];
    confirmedBioWeapons: number[];

    /**
     * List of boosts for commander types, listed as commander type numbers
     * ex: [3, 3, 4] => 2 move boost for type 3 commander, 1 move boost for type 4 commander
     */
    confirmedRaiseMorale: number[];
    confirmedCommInterrupt: number[];
    confirmedGoldenEye: number[];
    confirmedSeaMines: number[];
    seaMineHits: number[];
};

export type ConfirmedPlansType = { [pieceId: number]: singlePlan[] };

export type PlanningState = {
    active: boolean;
    capability: boolean;
    raiseMoralePopupActive: boolean;
    invItem: InvItemType | null;
    moves: singlePlan[];
    confirmedPlans: ConfirmedPlansType;
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
