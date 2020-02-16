import { GameboardPiecesDataType } from '../board';
import { BattleState, GameInfoState } from '../reducerTypes';
import { PieceType } from '../databaseTables';

export const EVENT_BATTLE = 'EVENT_BATTLE';
export type EventBattleAction = {
    type: typeof EVENT_BATTLE;
    payload: {
        friendlyPieces: BattleState['friendlyPieces'];
        enemyPieces: BattleState['enemyPieces'];
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
};

export const BATTLEPOPUP_MINIMIZE_TOGGLE = 'BATTLEPOPUP_MINIMIZE_TOGGLE';
export type BattlePopupToggleAction = {
    type: typeof BATTLEPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export const BATTLE_PIECE_SELECT = 'BATTLE_PIECE_SELECT';
export type BattlePieceSelectAction = {
    type: typeof BATTLE_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export const TARGET_PIECE_SELECT = 'TARGET_PIECE_SELECT';
export type TargetPieceClickAction = {
    type: typeof TARGET_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export const ENEMY_PIECE_SELECT = 'ENEMY_PIECE_SELECT';
export type EnemyPieceSelectAction = {
    type: typeof ENEMY_PIECE_SELECT;
    payload: {
        battlePiece: any;
        battlePieceIndex: number;
    };
};

export const SERVER_CONFIRM_BATTLE_SELECTION = 'SERVER_CONFIRM_BATTLE_SELECTION';
export type ConfirmBattleSelectionRequestAction = {
    type: typeof SERVER_CONFIRM_BATTLE_SELECTION;
    payload: {
        friendlyPieces: any;
    };
};

export const BATTLE_SELECTIONS = 'BATTLE_SELECTIONS';
export type BattleSelectionsAction = {
    type: typeof BATTLE_SELECTIONS;
    payload: {
        friendlyPieces: BattleState['friendlyPieces'];
        enemyPieces: BattleState['enemyPieces'];
    };
};

export type MasterRecordType = {
    attackPieceId: PieceType['pieceId'];
    targetPieceId?: PieceType['pieceId'];
    win?: boolean;
    diceRoll1?: 1 | 2 | 3 | 4 | 5 | 6;
    diceRoll2?: 1 | 2 | 3 | 4 | 5 | 6;
}[];

export const BATTLE_FIGHT_RESULTS = 'BATTLE_FIGHT_RESULTS';
export type BattleResultsAction = {
    type: typeof BATTLE_FIGHT_RESULTS;
    payload: {
        masterRecord: MasterRecordType;
    };
};

export const CLEAR_BATTLE = 'CLEAR_BATTLE';
export type ClearBattleAction = {
    type: typeof CLEAR_BATTLE;
    payload: {
        battle: BattleState;
    };
};

// TODO: This happens if no plans are made (better name might be NO_EVENTS (or 'READY_TO_STEP_AGAIN'))
export const NO_MORE_BATTLES = 'NO_MORE_BATTLES';
export type NoMoreBattlesAction = {
    type: typeof NO_MORE_BATTLES;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        gameStatus: GameInfoState['gameStatus'];
    };
};
