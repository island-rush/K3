//prettier-ignore
import { AnyAction } from "redux";
// prettier-ignore
import { CLEAR_BATTLE, COMBAT_PHASE, EVENT_BATTLE, EVENT_REFUEL, initialGameboardEmpty, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, NEW_ROUND, NO_MORE_EVENTS, OUTER_PIECE_CLICK_ACTION, PIECE_PLACE, PLACE_PHASE, RAISE_MORALE_SELECTED, REFUEL_RESULTS, REMOTE_SENSING_SELECTED, SLICE_CHANGE } from '../../../../constants';
// prettier-ignore
import { ClearBattleAction, EventBattleAction, FuelResultsAction, GameboardPiecesUpdateAction, GameInitialStateAction, InvItemPlaceAction, NoMoreEventsAction, PieceType, RaiseMoraleAction, SliceChangeAction, UpdatePiecesCombinedAction } from '../../../../types';

//TODO: should do the return at the bottom, not inside each case...(see metaReducer...)
function gameboardReducer(state = initialGameboardEmpty, action: AnyAction) {
    const { type } = action;
    let stateDeepCopy = JSON.parse(JSON.stringify(state));
    let freshBoard;
    let positions;
    switch (type) {
        case INITIAL_GAMESTATE:
            positions = Object.keys((action as GameInitialStateAction).payload.gameboardPieces);
            for (let x = 0; x < positions.length; x++) {
                stateDeepCopy[positions[x]].pieces = (action as GameInitialStateAction).payload.gameboardPieces[positions[x]];
            }
            return stateDeepCopy;
        case NEW_ROUND:
        case PLACE_PHASE:
            if ((action as UpdatePiecesCombinedAction).payload.gameboardPieces) {
                //this would happen on the 1st event (from executeStep)
                freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
                positions = Object.keys((action as UpdatePiecesCombinedAction).payload.gameboardPieces);
                for (let x = 0; x < positions.length; x++) {
                    // TODO: refactor with common action
                    freshBoard[positions[x]].pieces = (action as UpdatePiecesCombinedAction).payload.gameboardPieces[positions[x]];
                }
                return freshBoard;
            } else {
                return stateDeepCopy; //TODO: return at the bottom instead? (be consistent)
            }
        case SLICE_CHANGE:
            freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
            positions = Object.keys((action as SliceChangeAction).payload.gameboardPieces);
            for (let x = 0; x < positions.length; x++) {
                freshBoard[positions[x]].pieces = (action as SliceChangeAction).payload.gameboardPieces[positions[x]];
            }
            return freshBoard;
        case NO_MORE_EVENTS:
            if ((action as NoMoreEventsAction).payload.gameboardPieces) {
                //this would happen on the 1st event (from executeStep)
                freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
                positions = Object.keys((action as NoMoreEventsAction).payload.gameboardPieces);
                for (let x = 0; x < positions.length; x++) {
                    freshBoard[positions[x]].pieces = (action as NoMoreEventsAction).payload.gameboardPieces[positions[x]];
                }
                return freshBoard;
            } else {
                return stateDeepCopy;
            }
        case REMOTE_SENSING_SELECTED:
            freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
            positions = Object.keys((action as NoMoreEventsAction).payload.gameboardPieces);
            for (let x = 0; x < positions.length; x++) {
                freshBoard[positions[x]].pieces = (action as NoMoreEventsAction).payload.gameboardPieces[positions[x]];
            }
            return freshBoard;
        case RAISE_MORALE_SELECTED:
            freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
            positions = Object.keys((action as RaiseMoraleAction).payload.gameboardPieces);
            for (let x = 0; x < positions.length; x++) {
                freshBoard[positions[x]].pieces = (action as RaiseMoraleAction).payload.gameboardPieces[positions[x]];
            }
            return freshBoard;
        case EVENT_BATTLE:
            //TODO: refactor, done twice? (event_refuel...)
            if ((action as EventBattleAction).payload.gameboardPieces) {
                //this would happen on the 1st event (from executeStep)
                freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
                positions = Object.keys((action as EventBattleAction).payload.gameboardPieces);
                for (let x = 0; x < positions.length; x++) {
                    freshBoard[positions[x]].pieces = (action as EventBattleAction).payload.gameboardPieces[positions[x]];
                }
                return freshBoard;
            } else {
                return stateDeepCopy;
            }
        case COMBAT_PHASE:
        case OUTER_PIECE_CLICK_ACTION:
        case INNER_PIECE_CLICK_ACTION:
        case EVENT_REFUEL:
            if ((action as GameboardPiecesUpdateAction).payload.gameboardPieces) {
                //this would happen on the 1st event (from executeStep)
                freshBoard = JSON.parse(JSON.stringify(initialGameboardEmpty));
                positions = Object.keys((action as GameboardPiecesUpdateAction).payload.gameboardPieces);
                for (let x = 0; x < positions.length; x++) {
                    freshBoard[positions[x]].pieces = (action as GameboardPiecesUpdateAction).payload.gameboardPieces[positions[x]];
                }
                return freshBoard;
            } else {
                return stateDeepCopy;
            }
        case REFUEL_RESULTS:
            const { fuelUpdates } = (action as FuelResultsAction).payload;

            for (let y = 0; y < fuelUpdates.length; y++) {
                //need to find the piece on the board and update it, would be nice if we had the position...
                let thisFuelUpdate = fuelUpdates[y];
                let { pieceId, piecePositionId, newFuel } = thisFuelUpdate;
                for (let x = 0; x < stateDeepCopy[piecePositionId].pieces.length; x++) {
                    if (stateDeepCopy[piecePositionId].pieces[x].pieceId === pieceId) {
                        stateDeepCopy[piecePositionId].pieces[x].pieceFuel = newFuel;
                        break;
                    }
                }
            }

            return stateDeepCopy;
        case PIECE_PLACE:
            stateDeepCopy[(action as InvItemPlaceAction).payload.positionId].pieces.push((action as InvItemPlaceAction).payload.newPiece);
            return stateDeepCopy;
        case CLEAR_BATTLE:
            //remove pieces from the masterRecord that won?
            const { masterRecord, friendlyPieces, enemyPieces } = (action as ClearBattleAction).payload.battle;

            for (let x = 0; x < masterRecord.length; x++) {
                let currentRecord = masterRecord[x];
                let { targetId, win } = currentRecord;
                if (targetId && win) {
                    //need to remove the piece from the board...
                    let potentialPieceToRemove1 = friendlyPieces.find((battlePiece: any) => {
                        return battlePiece.piece.pieceId === targetId;
                    });
                    let potentialPieceToRemove2 = enemyPieces.find((battlePiece: any) => {
                        return battlePiece.piece.pieceId === targetId;
                    });

                    //don't know if was enemy or friendly (wasn't in the masterRecord (could change this to be more efficient...))
                    let battlePieceToRemove = potentialPieceToRemove1 || potentialPieceToRemove2;
                    let { pieceId, piecePositionId } = battlePieceToRemove.piece;

                    stateDeepCopy[piecePositionId].pieces = stateDeepCopy[piecePositionId].pieces.filter((piece: PieceType) => {
                        return piece.pieceId !== pieceId;
                    });
                }
            }

            return stateDeepCopy;
        default:
            return stateDeepCopy;
    }
}

export default gameboardReducer;
