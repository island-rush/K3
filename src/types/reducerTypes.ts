import { GameSession, GameType, InvItemType, PieceType, ShopItemType } from '.';

export type ShopState = ShopItemType[];

export type InvState = InvItemType[];

export type UserfeedbackState = string;

export type GameboardState = { type: string; pieces: PieceType[] }[];

export interface GameInfoState {
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
    container: {
        active: boolean;
        isSelectingHex: boolean;
        innerPieceToDrop: any;
        containerPiece: any;
        outerPieces: any[];
    };
}

export interface CapabilitiesState {
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
}

export interface PlanningState {
    active: boolean;
    capability: boolean;
    raiseMoralePopupActive: boolean;
    invItem: InvItemType | null;
    moves: { type: string; positionId: number }[];
    confirmedPlans: { [pieceId: number]: { type: string; positionId: number }[] };
}

export interface ContainerState {
    active: boolean;
    isSelectingHex: boolean;
    innerPieceToDrop: any;
    containerPiece: any;
    outerPieces: any;
}

export interface BattleState {
    isMinimized: boolean;
    active: boolean;
    selectedBattlePiece: any;
    selectedBattlePieceIndex: number; // helper to find the piece within the array
    masterRecord: any;
    friendlyPieces: any[];
    enemyPieces: any[];
}

export interface NewsState {
    isMinimized: boolean;
    active: boolean;
    newsTitle: string;
    newsInfo: string;
}

export interface RefuelState {
    isMinimized: boolean;
    active: boolean;
    selectedTankerPieceId: any;
    selectedTankerPieceIndex: number;
    tankers: any[];
    aircraft: any[];
}

/**
 * Formatted to copy the root reducer
 */
export type FullState = {
    userFeedback: UserfeedbackState;
    gameInfo: GameInfoState;
    shopItems: ShopState;
    invItems: InvState;
    gameboard: GameboardState;
    gameboardMeta: GameboardMetaState;
    capabilities: CapabilitiesState;
    planning: PlanningState;
    container: ContainerState;
    refuel: RefuelState;
    battle: BattleState;
    news: NewsState;
};
