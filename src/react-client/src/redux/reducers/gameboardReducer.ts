// prettier-ignore
import { CLEAR_BATTLE, COMBAT_PHASE, EVENT_BATTLE, EVENT_REFUEL, initialGameboardEmpty, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, NEW_ROUND, NO_MORE_EVENTS, OUTER_PIECE_CLICK_ACTION, PIECE_PLACE, PLACE_PHASE, RAISE_MORALE_SELECTED, REFUEL_RESULTS, REMOTE_SENSING_SELECTED, SLICE_CHANGE } from '../../../../constants';
// prettier-ignore
import { ClearBattleAction, CombatPhaseAction, EnterContainerAction, EventBattleAction, EventRefuelAction, ExitContainerAction, FuelResultsAction, GameboardState, GameInitialStateAction, InvItemPlaceAction, NewRoundAction, NoMoreEventsAction, PieceType, PlacePhaseAction, RaiseMoraleAction, RemoteSensingAction, SliceChangeAction } from '../../../../types';

type GameboardReducerActions =
    | GameInitialStateAction
    | NewRoundAction
    | PlacePhaseAction
    | SliceChangeAction
    | NoMoreEventsAction
    | RemoteSensingAction
    | RaiseMoraleAction
    | EventBattleAction
    | CombatPhaseAction
    | EnterContainerAction
    | ExitContainerAction
    | EventRefuelAction
    | FuelResultsAction
    | InvItemPlaceAction
    | ClearBattleAction;

/**
 * Each of these actions handled in the same way
 */
type GameboardPiecesUpdateAction =
    | GameInitialStateAction
    | NewRoundAction
    | PlacePhaseAction
    | SliceChangeAction
    | NoMoreEventsAction
    | RemoteSensingAction
    | RaiseMoraleAction
    | EventBattleAction
    | CombatPhaseAction
    | EnterContainerAction
    | ExitContainerAction
    | EventRefuelAction;

export function gameboardReducer(state = initialGameboardEmpty, action: GameboardReducerActions) {
    const { type } = action;

    let stateCopy: GameboardState = JSON.parse(JSON.stringify(state));
    let freshBoard: GameboardState = JSON.parse(JSON.stringify(initialGameboardEmpty));

    switch (type) {
        case INITIAL_GAMESTATE:
        case NEW_ROUND:
        case PLACE_PHASE:
        case SLICE_CHANGE:
        case NO_MORE_EVENTS:
        case REMOTE_SENSING_SELECTED:
        case RAISE_MORALE_SELECTED:
        case EVENT_BATTLE:
        case COMBAT_PHASE:
        case OUTER_PIECE_CLICK_ACTION:
        case INNER_PIECE_CLICK_ACTION:
        case EVENT_REFUEL:
            for (const positionIndex in (action as GameboardPiecesUpdateAction).payload.gameboardPieces) {
                freshBoard[positionIndex].pieces = (action as GameboardPiecesUpdateAction).payload.gameboardPieces[positionIndex];
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

                    stateCopy[piecePositionId].pieces = stateCopy[piecePositionId].pieces.filter((piece: PieceType) => {
                        return piece.pieceId !== pieceId;
                    });
                }
            }

            return stateCopy;

        default:
            return state;
    }
}
