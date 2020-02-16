import { AnyAction } from 'redux';
import { initialGameboardEmpty } from '../../../../constants';
// prettier-ignore
import { ClearBattleAction, CLEAR_BATTLE, CombatPhaseAction, COMBAT_PHASE, EnterContainerAction, EventBattleAction, EVENT_BATTLE, ExitContainerAction, FuelResultsAction, GameboardState, GameInitialStateAction, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, InvItemPlaceAction, NewRoundAction, NEW_ROUND, NoMoreBattlesAction, NO_MORE_BATTLES, OUTER_PIECE_CLICK_ACTION, PieceType, PIECE_PLACE, PlacePhaseAction, PLACE_PHASE, RaiseMoraleAction, RAISE_MORALE_SELECTED, REFUEL_RESULTS, RemoteSensingAction, RemoteSensingHitAction, REMOTE_SENSING_HIT_ACTION, REMOTE_SENSING_SELECTED, SliceChangeAction, SLICE_CHANGE } from '../../../../types';

export function gameboardReducer(state = initialGameboardEmpty, action: AnyAction) {
    const { type } = action;

    let stateCopy: GameboardState = JSON.parse(JSON.stringify(state));
    let freshBoard: GameboardState = JSON.parse(JSON.stringify(initialGameboardEmpty));

    switch (type) {
        case INITIAL_GAMESTATE:
        case NEW_ROUND:
        case PLACE_PHASE:
        case SLICE_CHANGE:
        case NO_MORE_BATTLES:
        case REMOTE_SENSING_SELECTED:
        case REMOTE_SENSING_HIT_ACTION:
        case RAISE_MORALE_SELECTED:
        case EVENT_BATTLE:
        case COMBAT_PHASE:
        case OUTER_PIECE_CLICK_ACTION:
        case INNER_PIECE_CLICK_ACTION:
            for (const positionIndex in (action as GameboardPiecesUpdateActions).payload.gameboardPieces) {
                freshBoard[positionIndex].pieces = (action as GameboardPiecesUpdateActions).payload.gameboardPieces[positionIndex];
            }

            return freshBoard;

        case REFUEL_RESULTS:
            const { fuelUpdates } = (action as FuelResultsAction).payload;

            for (let y = 0; y < fuelUpdates.length; y++) {
                //need to find the piece on the board and update it, would be nice if we had the position...
                let thisFuelUpdate = fuelUpdates[y];
                let { pieceId, piecePositionId, newFuel } = thisFuelUpdate;
                for (let x = 0; x < stateCopy[piecePositionId].pieces.length; x++) {
                    if (stateCopy[piecePositionId].pieces[x].pieceId === pieceId) {
                        stateCopy[piecePositionId].pieces[x].pieceFuel = newFuel;
                        break;
                    }
                }
            }

            return stateCopy;

        case PIECE_PLACE:
            stateCopy[(action as InvItemPlaceAction).payload.positionId].pieces.push((action as InvItemPlaceAction).payload.newPiece);
            return stateCopy;

        case CLEAR_BATTLE:
            //remove pieces from the masterRecord that won?
            const { masterRecord, friendlyPieces, enemyPieces } = (action as ClearBattleAction).payload.battle;

            if (!masterRecord) {
                return stateCopy;
            }

            for (let x = 0; x < masterRecord.length; x++) {
                let currentRecord = masterRecord[x];
                let { targetPieceId, win } = currentRecord;
                if (targetPieceId && win) {
                    //need to remove the piece from the board...
                    let potentialPieceToRemove1 = friendlyPieces.find((battlePiece: any) => {
                        return battlePiece.piece.pieceId === targetPieceId;
                    });
                    let potentialPieceToRemove2 = enemyPieces.find((battlePiece: any) => {
                        return battlePiece.piece.pieceId === targetPieceId;
                    });

                    //don't know if was enemy or friendly (wasn't in the masterRecord (could change this to be more efficient...))
                    let battlePieceToRemove = potentialPieceToRemove1 || potentialPieceToRemove2;
                    let { pieceId, piecePositionId } = battlePieceToRemove!.piece; // TODO: don't do exclamation mark // TODO: enemyPieces .piece isn't a PieceType (should be)

                    stateCopy[piecePositionId].pieces = stateCopy[piecePositionId].pieces.filter((piece: PieceType) => {
                        return piece.pieceId !== pieceId;
                    });
                }
            }

            return stateCopy;

        default:
            // Do nothing
            return state;
    }
}

type GameboardPiecesUpdateActions =
    | GameInitialStateAction
    | NewRoundAction
    | PlacePhaseAction
    | SliceChangeAction
    | NoMoreBattlesAction
    | RemoteSensingHitAction
    | RemoteSensingAction
    | RaiseMoraleAction
    | EventBattleAction
    | CombatPhaseAction
    | EnterContainerAction
    | ExitContainerAction;
