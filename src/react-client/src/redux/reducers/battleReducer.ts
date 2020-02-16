import { AnyAction } from 'redux';
// prettier-ignore
import { BattlePieceSelectAction, BATTLEPOPUP_MINIMIZE_TOGGLE, BattleResultsAction, BattleSelectionsAction, BattleState, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, BATTLE_SELECTIONS, CLEAR_BATTLE, EnemyPieceSelectAction, ENEMY_PIECE_SELECT, EventBattleAction, EVENT_BATTLE, GameInitialStateAction, INITIAL_GAMESTATE, NO_MORE_BATTLES, TargetPieceClickAction, TARGET_PIECE_SELECT } from '../../../../types';

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
            stateCopy.friendlyPieces[(action as TargetPieceClickAction).payload.battlePieceIndex].targetPiece = null;
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
            stateCopy.masterRecord = (action as BattleResultsAction).payload.masterRecord;

            //now need more stuff handled for things...
            for (let x = 0; x < stateCopy.friendlyPieces.length; x++) {
                //already knew the targets...
                //which ones win or not gets handled

                let currentRecord = (action as BattleResultsAction).payload.masterRecord.find(
                    (record: BattleResultsAction['payload']['masterRecord'][0], index: any) => {
                        return record.attackPieceId === stateCopy.friendlyPieces[x].piece.pieceId;
                    }
                );

                if (currentRecord !== undefined && currentRecord.targetPieceId !== undefined) {
                    stateCopy.friendlyPieces[x].win = currentRecord.win;
                    stateCopy.friendlyPieces[x].diceRoll1 = currentRecord.diceRoll1;
                    stateCopy.friendlyPieces[x].diceRoll2 = currentRecord.diceRoll2;
                }
            }

            for (let z = 0; z < stateCopy.enemyPieces.length; z++) {
                //for each enemy piece that know (from battle.enemyPieces)
                //add their target/dice information?

                //every piece should have a record from the battle, even if it didn't do anything... (things will be null...(reference Event.js))
                let currentRecord = (action as BattleResultsAction).payload.masterRecord.find(
                    (record: BattleResultsAction['payload']['masterRecord'][0], index: number) => {
                        return record.attackPieceId === stateCopy.enemyPieces[z].piece.pieceId;
                    }
                );

                if (currentRecord !== undefined && currentRecord.targetPieceId) {
                    const { attackPieceId, targetPieceId, win, diceRoll1, diceRoll2 } = currentRecord;

                    //get the target information from the friendlyPieces
                    // TODO: could refactor this to be better, lots of lookups probably not good
                    let friendlyPieceIndex = stateCopy.friendlyPieces.findIndex(
                        (friendlyBattlePiece: any) => friendlyBattlePiece.piece.pieceId === targetPieceId
                    );
                    let friendlyPiece = stateCopy.friendlyPieces[friendlyPieceIndex];
                    let enemyPieceIndex = stateCopy.enemyPieces.findIndex(
                        (enemyBattlePiece: any) => enemyBattlePiece.piece.pieceId === attackPieceId
                    );
                    stateCopy.enemyPieces[enemyPieceIndex].targetPiece = friendlyPiece.piece;
                    stateCopy.enemyPieces[enemyPieceIndex].targetPieceIndex = friendlyPieceIndex;
                    stateCopy.enemyPieces[enemyPieceIndex].win = win;
                    stateCopy.enemyPieces[enemyPieceIndex].diceRoll1 = diceRoll1;
                    stateCopy.enemyPieces[enemyPieceIndex].diceRoll2 = diceRoll2;
                }
            }

            return stateCopy;

        case CLEAR_BATTLE:
            //probably a more efficient way of removing elements from the master record/friendlyPieces/enemyPieces
            if (!stateCopy.masterRecord) {
                return stateCopy;
            }

            for (let z = 0; z < stateCopy.masterRecord.length; z++) {
                let thisRecord = stateCopy.masterRecord[z];
                if (thisRecord.targetPieceId && thisRecord.win) {
                    //need to delete that targetId from friendlyList or enemyList
                    stateCopy.friendlyPieces = stateCopy.friendlyPieces.filter((battlePiece: any) => {
                        return battlePiece.piece.pieceId !== thisRecord.targetPieceId;
                    });
                    stateCopy.enemyPieces = stateCopy.enemyPieces.filter((battlePiece: any) => {
                        return battlePiece.piece.pieceId !== thisRecord.targetPieceId;
                    });
                }
            }

            for (let x = 0; x < stateCopy.friendlyPieces.length; x++) {
                //for each friendly piece, clear the dice roll and other stuff
                stateCopy.friendlyPieces[x].targetPiece = null;
                stateCopy.friendlyPieces[x].targetPieceIndex = -1;
                delete stateCopy.friendlyPieces[x].win;
                delete stateCopy.friendlyPieces[x].diceRoll1;
                delete stateCopy.friendlyPieces[x].diceRoll2;
            }
            for (let x = 0; x < stateCopy.enemyPieces.length; x++) {
                //for each friendly piece, clear the dice roll and other stuff
                stateCopy.enemyPieces[x].targetPiece = null;
                stateCopy.enemyPieces[x].targetPieceIndex = -1;
                delete stateCopy.enemyPieces[x].win;
                delete stateCopy.enemyPieces[x].diceRoll1;
                delete stateCopy.enemyPieces[x].diceRoll2;
            }

            delete stateCopy.masterRecord;

            return stateCopy;

        default:
            // Do nothing
            return state;
    }
}
