import { AnyAction } from 'redux';
// prettier-ignore
import { BattlePieceSelectAction, BATTLEPOPUP_MINIMIZE_TOGGLE, BattleResultsAction, BattleSelectionsAction, BattleState, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, BATTLE_SELECTIONS, CLEAR_BATTLE, EnemyPieceSelectAction, ENEMY_PIECE_SELECT, EventBattleAction, EVENT_BATTLE, GameInitialStateAction, INITIAL_GAMESTATE, NO_MORE_BATTLES, TargetPieceClickAction, TARGET_PIECE_SELECT, BlueOrRedTeamId } from '../../../../types';
import { BLUE_TEAM_ID } from '../../../../constants';

const initialBattleState: BattleState = {
    isMinimized: false,
    isActive: false,
    selectedBattlePiece: -1,
    selectedBattlePieceIndex: -1, //helper to find the piece within the array
    masterRecord: null,
    friendlyPieces: [],
    enemyPieces: []
};

export function battleReducer(state = initialBattleState, action: AnyAction) {
    const { type } = action;

    let stateCopy: BattleState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            if ((action as GameInitialStateAction).payload.battle) {
                stateCopy.friendlyPieces = (action as GameInitialStateAction).payload.battle!.friendlyPieces;
                stateCopy.enemyPieces = (action as GameInitialStateAction).payload.battle!.enemyPieces;
                stateCopy.isActive = true;
            }
            return stateCopy;

        case BATTLE_PIECE_SELECT:
            //select if different, unselect if was the same
            let lastSelectedBattlePiece = stateCopy.selectedBattlePiece;
            stateCopy.selectedBattlePiece =
                (action as BattlePieceSelectAction).payload.battlePiece.piece.pieceId === lastSelectedBattlePiece
                    ? -1
                    : (action as BattlePieceSelectAction).payload.battlePiece.piece.pieceId;
            stateCopy.selectedBattlePieceIndex =
                (action as BattlePieceSelectAction).payload.battlePiece.piece.pieceId === lastSelectedBattlePiece
                    ? -1
                    : (action as BattlePieceSelectAction).payload.battlePieceIndex;
            return stateCopy;

        case BATTLEPOPUP_MINIMIZE_TOGGLE:
            stateCopy.isMinimized = !stateCopy.isMinimized;
            return stateCopy;

        case ENEMY_PIECE_SELECT:
            //need to get the piece that was selected, and put it into the target for the thing
            stateCopy.friendlyPieces[stateCopy.selectedBattlePieceIndex].targetPiece = (action as EnemyPieceSelectAction).payload.battlePiece.piece;
            stateCopy.friendlyPieces[
                stateCopy.selectedBattlePieceIndex
            ].targetPieceIndex = (action as EnemyPieceSelectAction).payload.battlePieceIndex;

            return stateCopy;

        case TARGET_PIECE_SELECT:
            //removing the target piece
            stateCopy.friendlyPieces[(action as TargetPieceClickAction).payload.battlePieceIndex].targetPiece = undefined;
            stateCopy.friendlyPieces[(action as TargetPieceClickAction).payload.battlePieceIndex].targetPieceIndex = -1;
            return stateCopy;

        case EVENT_BATTLE:
            stateCopy = {
                isMinimized: false,
                isActive: false,
                selectedBattlePiece: -1,
                selectedBattlePieceIndex: -1, //helper to find the piece within the array
                masterRecord: null,
                friendlyPieces: [],
                enemyPieces: []
            };
            stateCopy.isActive = true;
            stateCopy.isMinimized = true;
            stateCopy.friendlyPieces = (action as EventBattleAction).payload.friendlyPieces;
            stateCopy.enemyPieces = (action as EventBattleAction).payload.enemyPieces;
            return stateCopy;

        case NO_MORE_BATTLES:
            stateCopy.isMinimized = false;
            stateCopy.isActive = false;
            stateCopy.selectedBattlePiece = -1;
            stateCopy.selectedBattlePieceIndex = -1;
            stateCopy.masterRecord = null;
            stateCopy.friendlyPieces = [];
            stateCopy.enemyPieces = [];
            return stateCopy;

        case BATTLE_SELECTIONS:
            stateCopy.selectedBattlePiece = -1;
            stateCopy.selectedBattlePieceIndex = -1;
            stateCopy.friendlyPieces = (action as BattleSelectionsAction).payload.friendlyPieces;
            return stateCopy;

        case BATTLE_FIGHT_RESULTS:
            stateCopy.selectedBattlePiece = -1;
            stateCopy.selectedBattlePieceIndex = -1;

            const gameTeam: BlueOrRedTeamId = action.gameTeam; // given in websocket.ts
            // prettier-ignore
            stateCopy.friendlyPieces = gameTeam === BLUE_TEAM_ID ? (action as BattleResultsAction).payload.blueFriendlyBattlePieces : (action as BattleResultsAction).payload.redFriendlyBattlePieces;
            // prettier-ignore
            stateCopy.enemyPieces = gameTeam === BLUE_TEAM_ID ? (action as BattleResultsAction).payload.redFriendlyBattlePieces : (action as BattleResultsAction).payload.blueFriendlyBattlePieces;

            stateCopy.masterRecord = (action as BattleResultsAction).payload.masterRecord;

            // for each friendly and enemy battle piece, find the master record information and add it
            for (let x = 0; x < stateCopy.friendlyPieces.length; x++) {
                const currentBattlePiece = stateCopy.friendlyPieces[x];
                const currentRecord = (action as BattleResultsAction).payload.masterRecord.find(
                    (record: BattleResultsAction['payload']['masterRecord'][0], index: any) => {
                        return record.attackPieceId === currentBattlePiece.piece.pieceId;
                    }
                );
                if (currentRecord !== undefined && currentRecord.targetPieceId !== undefined) {
                    stateCopy.friendlyPieces[x].win = currentRecord.win;
                    stateCopy.friendlyPieces[x].diceRoll1 = currentRecord.diceRoll1;
                    stateCopy.friendlyPieces[x].diceRoll2 = currentRecord.diceRoll2;
                }
            }
            for (let x = 0; x < stateCopy.enemyPieces.length; x++) {
                const currentBattlePiece = stateCopy.enemyPieces[x];
                const currentRecord = (action as BattleResultsAction).payload.masterRecord.find(
                    (record: BattleResultsAction['payload']['masterRecord'][0], index: any) => {
                        return record.attackPieceId === currentBattlePiece.piece.pieceId;
                    }
                );
                if (currentRecord !== undefined && currentRecord.targetPieceId !== undefined) {
                    stateCopy.enemyPieces[x].win = currentRecord.win;
                    stateCopy.enemyPieces[x].diceRoll1 = currentRecord.diceRoll1;
                    stateCopy.enemyPieces[x].diceRoll2 = currentRecord.diceRoll2;
                }
            }

            return stateCopy;

        case CLEAR_BATTLE:
            // Ok to assume masterRecord exists if we ever call CLEAR_BATTLE
            if (!stateCopy.masterRecord) {
                return stateCopy;
            }

            // Delete pieces that lost
            for (let x = 0; x < stateCopy.masterRecord.length; x++) {
                const currentRecord = stateCopy.masterRecord[x];
                if (currentRecord.win) {
                    // don't know which list, try to delete from both
                    stateCopy.friendlyPieces = stateCopy.friendlyPieces.filter((battlePiece: any) => {
                        return battlePiece.piece.pieceId !== currentRecord.targetPieceId;
                    });
                    stateCopy.enemyPieces = stateCopy.enemyPieces.filter((battlePiece: any) => {
                        return battlePiece.piece.pieceId !== currentRecord.targetPieceId;
                    });
                }
            }

            delete stateCopy.masterRecord;

            // Get rid of targetting / win / dice
            for (let x = 0; x < stateCopy.friendlyPieces.length; x++) {
                stateCopy.friendlyPieces[x] = {
                    piece: stateCopy.friendlyPieces[x].piece
                };
            }
            for (let x = 0; x < stateCopy.enemyPieces.length; x++) {
                stateCopy.enemyPieces[x] = {
                    piece: stateCopy.enemyPieces[x].piece
                };
            }

            return stateCopy;

        default:
            // Do nothing
            return state;
    }
}
