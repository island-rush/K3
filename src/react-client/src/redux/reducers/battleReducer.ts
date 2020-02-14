import { AnyAction } from 'redux';
// prettier-ignore
import { BATTLEPOPUP_MINIMIZE_TOGGLE, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, CLEAR_BATTLE, ENEMY_PIECE_SELECT, EVENT_BATTLE, INITIAL_GAMESTATE, NO_MORE_BATTLES, TARGET_PIECE_SELECT } from '../../../../constants';
// prettier-ignore
import { BattlePieceSelectAction, BattleResultsAction, BattleState, EnemyPieceSelectAction, EventBattleAction, GameInitialStateAction, TargetPieceClickAction } from '../../../../types';

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
            stateCopy = initialBattleState;
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

        case BATTLE_FIGHT_RESULTS:
            stateCopy.masterRecord = (action as BattleResultsAction).payload.masterRecord;

            //now need more stuff handled for things...
            for (let x = 0; x < stateCopy.friendlyPieces.length; x++) {
                //already knew the targets...
                //which ones win or not gets handled

                let currentRecord = (action as BattleResultsAction).payload.masterRecord.find((record: any, index: any) => {
                    return record.pieceId === stateCopy.friendlyPieces[x].piece.pieceId;
                });

                let { targetId, diceRoll, win, diceRoll1, diceRoll2 } = currentRecord;

                if (targetId) {
                    stateCopy.friendlyPieces[x].diceRoll = diceRoll;
                    stateCopy.friendlyPieces[x].win = win;
                    stateCopy.friendlyPieces[x].diceRoll1 = diceRoll1;
                    stateCopy.friendlyPieces[x].diceRoll2 = diceRoll2;
                }
            }

            for (let z = 0; z < stateCopy.enemyPieces.length; z++) {
                //for each enemy piece that know (from battle.enemyPieces)
                //add their target/dice information?

                //every piece should have a record from the battle, even if it didn't do anything... (things will be null...(reference Event.js))
                let currentRecord = (action as BattleResultsAction).payload.masterRecord.find((record: any, index: number) => {
                    return record.pieceId === stateCopy.enemyPieces[z].piece.pieceId;
                });

                let { pieceId, targetId, diceRoll, win, diceRoll1, diceRoll2 } = currentRecord;

                if (targetId) {
                    //get the target information from the friendlyPieces
                    // TODO: could refactor this to be better, lots of lookups probably not good
                    let friendlyPieceIndex = stateCopy.friendlyPieces.findIndex(
                        (friendlyBattlePiece: any) => friendlyBattlePiece.piece.pieceId === targetId
                    );
                    let friendlyPiece = stateCopy.friendlyPieces[friendlyPieceIndex];
                    let enemyPieceIndex = stateCopy.enemyPieces.findIndex((enemyBattlePiece: any) => enemyBattlePiece.piece.pieceId === pieceId);
                    stateCopy.enemyPieces[enemyPieceIndex].targetPiece = friendlyPiece.piece;
                    stateCopy.enemyPieces[enemyPieceIndex].targetPieceIndex = friendlyPieceIndex;
                    stateCopy.enemyPieces[enemyPieceIndex].win = win;
                    stateCopy.enemyPieces[enemyPieceIndex].diceRoll = diceRoll;
                    stateCopy.enemyPieces[enemyPieceIndex].diceRoll1 = diceRoll1;
                    stateCopy.enemyPieces[enemyPieceIndex].diceRoll2 = diceRoll2;
                }
            }

            return stateCopy;

        case CLEAR_BATTLE:
            //probably a more efficient way of removing elements from the master record/friendlyPieces/enemyPieces
            for (let z = 0; z < stateCopy.masterRecord.length; z++) {
                let thisRecord = stateCopy.masterRecord[z];
                if (thisRecord.targetId && thisRecord.win) {
                    //need to delete that targetId from friendlyList or enemyList
                    stateCopy.friendlyPieces = stateCopy.friendlyPieces.filter((battlePiece: any) => {
                        return battlePiece.piece.pieceId !== thisRecord.targetId;
                    });
                    stateCopy.enemyPieces = stateCopy.enemyPieces.filter((battlePiece: any) => {
                        return battlePiece.piece.pieceId !== thisRecord.targetId;
                    });
                }
            }

            for (let x = 0; x < stateCopy.friendlyPieces.length; x++) {
                //for each friendly piece, clear the dice roll and other stuff
                stateCopy.friendlyPieces[x].targetPiece = null;
                stateCopy.friendlyPieces[x].targetPieceIndex = -1;
                delete stateCopy.friendlyPieces[x].diceRoll;
                delete stateCopy.friendlyPieces[x].win;
            }
            for (let x = 0; x < stateCopy.enemyPieces.length; x++) {
                //for each friendly piece, clear the dice roll and other stuff
                stateCopy.enemyPieces[x].targetPiece = null;
                stateCopy.enemyPieces[x].targetPieceIndex = -1;
                delete stateCopy.enemyPieces[x].diceRoll;
                delete stateCopy.enemyPieces[x].win;
            }

            delete stateCopy.masterRecord;

            return stateCopy;

        default:
            // Do nothing
            return state;
    }
}
