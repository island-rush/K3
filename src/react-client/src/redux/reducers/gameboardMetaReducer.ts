//TODO: make this file less thiccc, it's getting pretty hefty (maybe use more reducers to keep it clean....)
import { AnyAction } from 'redux';
// prettier-ignore
import { AIRCRAFT_CLICK, ALL_GROUND_TYPES, BATTLEPOPUP_MINIMIZE_TOGGLE, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, BIO_WEAPON_SELECTED, BIO_WEAPON_SELECTING, CANCEL_PLAN, CLEAR_BATTLE, COMM_INTERRUPT_SELECTING, COMM_INTERRUP_SELECTED, DELETE_PLAN, distanceMatrix, ENEMY_PIECE_SELECT, EVENT_BATTLE, EVENT_REFUEL, GOLDEN_EYE_SELECTED, GOLDEN_EYE_SELECTING, HIGHLIGHT_POSITIONS, initialGameboardEmpty, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, INNER_TRANSPORT_PIECE_CLICK_ACTION, INSURGENCY_SELECTED, INSURGENCY_SELECTING, MENU_SELECT, NEWSPOPUP_MINIMIZE_TOGGLE, NEWS_PHASE, NO_MORE_EVENTS, OUTER_PIECE_CLICK_ACTION, PIECE_CLEAR_SELECTION, PIECE_CLICK, PIECE_CLOSE_ACTION, PIECE_OPEN_ACTION, PLANNING_SELECT, PLAN_WAS_CONFIRMED, POSITION_SELECT, PURCHASE_PHASE, RAISE_MORALE_SELECTED, RAISE_MORALE_SELECTING, REFUELPOPUP_MINIMIZE_TOGGLE, REFUEL_RESULTS, REMOTE_SENSING_SELECTED, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTED, RODS_FROM_GOD_SELECTING, SLICE_CHANGE, START_PLAN, TANKER_CLICK, TARGET_PIECE_SELECT, TRANSPORT_TYPE_ID, TYPE_FUEL, UNDO_FUEL_SELECTION, UNDO_MOVE } from '../../../../constants';
// prettier-ignore
import { AircraftClickAction, BattlePieceSelectAction, BattleResultsAction, ConfirmPlanAction, DeletePlanAction, EnemyPieceSelectAction, EnterContainerAction, EventBattleAction, EventRefuelAction, ExitContainerAction, ExitTransportContainerAction, GameboardMetaState, GameInitialStateAction, HighlightPositionsAction, MenuSelectAction, NewsPhaseAction, PieceClickAction, PieceOpenAction, PieceType, PlanningSelectAction, PositionSelectAction, RaiseMoraleSelectingAction, SelectingAction, TankerClickAction, TargetPieceClickAction, UndoFuelSelectionAction } from '../../../../types';

const initialGameboardMeta: GameboardMetaState = {
    //TODO: change to selectedPositionId and selectedPieceId to better represent the values (ints) (and also selectedBattlePiece -> selectedBattlePieceId)
    selectedPosition: -1, //TODO: constant for 'NOTHING_SELECTED_VALUE' = -1
    highlightedPositions: [],
    selectedPiece: null,
    selectedMenuId: 0, //TODO: should probably 0 index this instead of 1 index (make -1 == no menu open)
    news: {
        isMinimized: false,
        active: false,
        newsTitle: 'Loading Title...',
        newsInfo: 'Loading Info...'
    },
    battle: {
        isMinimized: false,
        active: false,
        selectedBattlePiece: -1,
        selectedBattlePieceIndex: -1, //helper to find the piece within the array
        masterRecord: null,
        friendlyPieces: [],
        enemyPieces: []
    },
    refuel: {
        isMinimized: false,
        active: false,
        selectedTankerPieceId: -1,
        selectedTankerPieceIndex: -1,
        tankers: [],
        aircraft: []
    },
    container: {
        active: false,
        isSelectingHex: false,
        innerPieceToDrop: null,
        containerPiece: null,
        outerPieces: []
    },
    planning: {
        active: false,
        capability: false,
        raiseMoralePopupActive: false,
        invItem: null,
        moves: []
    },
    confirmedPlans: {}
};

export function gameboardMetaReducer(state = initialGameboardMeta, action: AnyAction) {
    const { type } = action;

    let stateCopy: GameboardMetaState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case HIGHLIGHT_POSITIONS:
            stateCopy.highlightedPositions = (action as HighlightPositionsAction).payload.highlightedPositions;
            return stateCopy;

        case MENU_SELECT:
            stateCopy.selectedMenuId =
                (action as MenuSelectAction).payload.selectedMenuId !== stateCopy.selectedMenuId
                    ? (action as MenuSelectAction).payload.selectedMenuId
                    : 0;
            return stateCopy;

        case POSITION_SELECT:
            stateCopy.selectedPosition = (action as PositionSelectAction).payload.selectedPositionId;
            // stateCopy.highlightedPositions = [];
            return stateCopy;

        case PURCHASE_PHASE:
            stateCopy.news.active = false; //hide the popup
            return stateCopy;

        case TANKER_CLICK:
            //select if different, unselect if was the same
            let lastSelectedTankerId = stateCopy.refuel.selectedTankerPieceId;
            stateCopy.refuel.selectedTankerPieceId =
                (action as TankerClickAction).payload.tankerPiece.pieceId === lastSelectedTankerId
                    ? -1
                    : (action as TankerClickAction).payload.tankerPiece.pieceId;
            stateCopy.refuel.selectedTankerPieceIndex =
                (action as TankerClickAction).payload.tankerPiece.pieceId === lastSelectedTankerId
                    ? -1
                    : (action as TankerClickAction).payload.tankerPieceIndex;
            return stateCopy;

        case PIECE_OPEN_ACTION:
            stateCopy.container.active = true;
            stateCopy.container.containerPiece = (action as PieceOpenAction).payload.selectedPiece;
            let selectedPiecePosition = (action as PieceOpenAction).payload.selectedPiece.piecePositionId;
            let selectedPieceTypeId = (action as PieceOpenAction).payload.selectedPiece.pieceTypeId;

            //outerPieces is dependent on selectedPieceTypeId (surrounding land if transport...)
            //TODO: this can be cleaned up with modern for.each syntact -> for (let x of y)? something like that (it was used somewhere else so search for it)
            if (selectedPieceTypeId === TRANSPORT_TYPE_ID) {
                for (let x = 0; x < distanceMatrix[selectedPiecePosition].length; x++) {
                    //TODO: do we need a constant for '1'? transports can only pick up pieces from 1 hex away seems obvious
                    if (distanceMatrix[selectedPiecePosition][x] <= 1 && ALL_GROUND_TYPES.includes(initialGameboardEmpty[x].type)) {
                        //TODO: better way of combining arrays (no internet while i'm coding this mid-flight)
                        for (let y = 0; y < (action as PieceOpenAction).payload.gameboard[x].pieces.length; y++) {
                            //TODO: only put pieces here if they are able to get onto transport pieces
                            if (
                                (action as PieceOpenAction).payload.gameboard[x].pieces[y].pieceId ===
                                (action as PieceOpenAction).payload.selectedPiece.pieceId
                            )
                                continue;
                            stateCopy.container.outerPieces.push((action as PieceOpenAction).payload.gameboard[x].pieces[y]);
                        }
                    }
                }

                //now for each of those positions...
            } else {
                //other container types only look in their own position (probably...//TODO: write down the rules for this later )

                stateCopy.container.outerPieces = (action as PieceOpenAction).payload.gameboard[selectedPiecePosition].pieces.filter(
                    (piece: PieceType, index: number) => {
                        return piece.pieceId !== (action as PieceOpenAction).payload.selectedPiece.pieceId;
                    }
                );
            }
            return stateCopy;

        case PIECE_CLOSE_ACTION:
            stateCopy.container.active = false;
            stateCopy.container.containerPiece = null;
            stateCopy.container.outerPieces = [];
            stateCopy.container.isSelectingHex = false;
            stateCopy.container.innerPieceToDrop = null;
            return stateCopy;

        case INNER_TRANSPORT_PIECE_CLICK_ACTION:
            stateCopy.container.isSelectingHex = true;
            stateCopy.container.innerPieceToDrop = (action as ExitTransportContainerAction).payload.selectedPiece;
            return stateCopy;

        case OUTER_PIECE_CLICK_ACTION:
            //need the piece to go inside the container
            //remove from outerpieces
            //add to innerpieces
            stateCopy.container.outerPieces = stateCopy.container.outerPieces.filter((piece: PieceType, index: number) => {
                return piece.pieceId !== (action as EnterContainerAction).payload.selectedPiece.pieceId;
            });
            stateCopy.container.containerPiece.pieceContents.pieces.push((action as EnterContainerAction).payload.selectedPiece);
            return stateCopy;

        case INNER_PIECE_CLICK_ACTION:
            //need the piece to go outside the container
            //remove from the container piece
            //add to the outer pieces
            stateCopy.container.isSelectingHex = false;
            stateCopy.container.innerPieceToDrop = null;
            stateCopy.container.containerPiece.pieceContents.pieces = stateCopy.container.containerPiece.pieceContents.pieces.filter(
                (piece: PieceType, index: number) => {
                    return piece.pieceId !== (action as ExitContainerAction).payload.selectedPiece.pieceId;
                }
            );
            stateCopy.container.outerPieces.push((action as ExitContainerAction).payload.selectedPiece);
            return stateCopy;

        case AIRCRAFT_CLICK:
            //show which tanker is giving the aircraft...
            let { aircraftPieceIndex, aircraftPiece } = (action as AircraftClickAction).payload;
            const { selectedTankerPieceId, selectedTankerPieceIndex } = stateCopy.refuel;

            stateCopy.refuel.aircraft[aircraftPieceIndex].tankerPieceId = selectedTankerPieceId;
            stateCopy.refuel.aircraft[aircraftPieceIndex].tankerPieceIndex = selectedTankerPieceIndex;

            //need how much fuel is getting removed
            const fuelToRemove = TYPE_FUEL[aircraftPiece.pieceTypeId] - aircraftPiece.pieceFuel;

            if (!stateCopy.refuel.tankers[selectedTankerPieceIndex].removedFuel) {
                stateCopy.refuel.tankers[selectedTankerPieceIndex].removedFuel = 0;
            }
            stateCopy.refuel.tankers[selectedTankerPieceIndex].removedFuel += fuelToRemove;

            return stateCopy;

        case UNDO_FUEL_SELECTION:
            //TODO: needs some good refactoring
            // let airPiece = payload.aircraftPiece;
            let airPieceIndex = (action as UndoFuelSelectionAction).payload.aircraftPieceIndex;
            let tankerPieceIndex2 = stateCopy.refuel.aircraft[airPieceIndex].tankerPieceIndex;

            let pieceType = stateCopy.refuel.aircraft[airPieceIndex].pieceTypeId;
            let fuelThatWasGoingToGetAdded = TYPE_FUEL[pieceType] - stateCopy.refuel.aircraft[airPieceIndex].pieceFuel;

            stateCopy.refuel.aircraft[airPieceIndex].tankerPieceId = null;
            stateCopy.refuel.aircraft[airPieceIndex].tankerPieceIndex = null;
            stateCopy.refuel.tankers[tankerPieceIndex2].removedFuel -= fuelThatWasGoingToGetAdded;
            return stateCopy;

        case REFUEL_RESULTS:
            stateCopy.refuel = initialGameboardMeta.refuel;
            return stateCopy;

        case NEWS_PHASE:
            stateCopy.news = (action as NewsPhaseAction).payload.news;
            return stateCopy;

        case PIECE_CLICK:
            stateCopy.selectedPiece = (action as PieceClickAction).payload.selectedPiece;
            return stateCopy;

        case PIECE_CLEAR_SELECTION:
            stateCopy.selectedPiece = null;
            return stateCopy;

        case START_PLAN:
            stateCopy.planning.active = true;
            return stateCopy;

        case RAISE_MORALE_SELECTING:
            stateCopy.planning.active = true;
            stateCopy.planning.capability = true;
            stateCopy.planning.invItem = (action as RaiseMoraleSelectingAction).payload.invItem;
            stateCopy.planning.raiseMoralePopupActive = true;
            stateCopy.selectedMenuId = 0;
            return stateCopy;

        case RAISE_MORALE_SELECTED:
            stateCopy.planning.capability = false;
            stateCopy.planning.invItem = null;
            stateCopy.planning.active = false;
            stateCopy.planning.raiseMoralePopupActive = false;
            return stateCopy;

        case INSURGENCY_SELECTING:
        case BIO_WEAPON_SELECTING:
        case COMM_INTERRUPT_SELECTING:
        case RODS_FROM_GOD_SELECTING:
        case GOLDEN_EYE_SELECTING:
        case REMOTE_SENSING_SELECTING:
            stateCopy.planning.active = true;
            stateCopy.planning.capability = true;
            stateCopy.planning.invItem = (action as SelectingAction).payload.invItem;
            stateCopy.selectedMenuId = 0;
            return stateCopy;

        case RODS_FROM_GOD_SELECTED:
            stateCopy.planning.capability = false;
            stateCopy.planning.invItem = null;
            stateCopy.planning.active = false;
            return stateCopy;

        case BIO_WEAPON_SELECTED:
            stateCopy.planning.capability = false;
            stateCopy.planning.invItem = null;
            stateCopy.planning.active = false;
            return stateCopy;

        case COMM_INTERRUP_SELECTED:
            stateCopy.planning.capability = false;
            stateCopy.planning.invItem = null;
            stateCopy.planning.active = false;
            return stateCopy;

        case INSURGENCY_SELECTED:
            stateCopy.planning.capability = false;
            stateCopy.planning.invItem = null;
            stateCopy.planning.active = false;
            return stateCopy;

        case REMOTE_SENSING_SELECTED:
            stateCopy.planning.capability = false;
            stateCopy.planning.invItem = null;
            stateCopy.planning.active = false;
            return stateCopy;

        case GOLDEN_EYE_SELECTED:
            stateCopy.planning.capability = false;
            stateCopy.planning.invItem = null;
            stateCopy.planning.active = false;
            return stateCopy;

        case CANCEL_PLAN:
            stateCopy.planning.active = false;
            stateCopy.planning.capability = false;
            stateCopy.planning.moves = [];
            stateCopy.selectedPiece = null;
            return stateCopy;

        case UNDO_MOVE:
            stateCopy.planning.moves.pop();
            return stateCopy;

        case PLANNING_SELECT:
            //TODO: move this to userActions to have more checks there within the thunk
            stateCopy.planning.moves.push({
                type: 'move',
                positionId: (action as PlanningSelectAction).payload.selectedPositionId
            });
            return stateCopy;

        case PLAN_WAS_CONFIRMED:
            const { pieceId, plan } = (action as ConfirmPlanAction).payload;
            stateCopy.confirmedPlans[pieceId] = plan;
            stateCopy.planning.active = false;
            stateCopy.planning.moves = [];
            stateCopy.selectedPiece = null;
            return stateCopy;

        case DELETE_PLAN:
            delete stateCopy.confirmedPlans[(action as DeletePlanAction).payload.pieceId];
            stateCopy.selectedPiece = null;
            return stateCopy;

        case EVENT_REFUEL:
            stateCopy.refuel.active = true;
            stateCopy.refuel.tankers = (action as EventRefuelAction).payload.tankers;
            stateCopy.refuel.aircraft = (action as EventRefuelAction).payload.aircraft;
            stateCopy.refuel.selectedTankerPieceId = -1;
            stateCopy.refuel.selectedTankerPieceIndex = -1;
            return stateCopy;

        case REFUELPOPUP_MINIMIZE_TOGGLE:
            stateCopy.refuel.isMinimized = !stateCopy.refuel.isMinimized;
            return stateCopy;

        case INITIAL_GAMESTATE:
            Object.assign(stateCopy, (action as GameInitialStateAction).payload.gameboardMeta);
            return stateCopy;

        case NEWSPOPUP_MINIMIZE_TOGGLE:
            stateCopy.news.isMinimized = !stateCopy.news.isMinimized;
            return stateCopy;

        case SLICE_CHANGE:
            stateCopy.confirmedPlans = {};
            return stateCopy;

        case BATTLE_PIECE_SELECT:
            //select if different, unselect if was the same
            let lastSelectedBattlePiece = stateCopy.battle.selectedBattlePiece;
            stateCopy.battle.selectedBattlePiece =
                (action as BattlePieceSelectAction).payload.battlePiece.piece.pieceId === lastSelectedBattlePiece
                    ? -1
                    : (action as BattlePieceSelectAction).payload.battlePiece.piece.pieceId;
            stateCopy.battle.selectedBattlePieceIndex =
                (action as BattlePieceSelectAction).payload.battlePiece.piece.pieceId === lastSelectedBattlePiece
                    ? -1
                    : (action as BattlePieceSelectAction).payload.battlePieceIndex;
            return stateCopy;

        case BATTLEPOPUP_MINIMIZE_TOGGLE:
            stateCopy.battle.isMinimized = !stateCopy.battle.isMinimized;
            return stateCopy;

        case ENEMY_PIECE_SELECT:
            //need to get the piece that was selected, and put it into the target for the thing
            stateCopy.battle.friendlyPieces[
                stateCopy.battle.selectedBattlePieceIndex
            ].targetPiece = (action as EnemyPieceSelectAction).payload.battlePiece.piece;
            stateCopy.battle.friendlyPieces[
                stateCopy.battle.selectedBattlePieceIndex
            ].targetPieceIndex = (action as EnemyPieceSelectAction).payload.battlePieceIndex;

            return stateCopy;

        case TARGET_PIECE_SELECT:
            //removing the target piece
            stateCopy.battle.friendlyPieces[(action as TargetPieceClickAction).payload.battlePieceIndex].targetPiece = null;
            stateCopy.battle.friendlyPieces[(action as TargetPieceClickAction).payload.battlePieceIndex].targetPieceIndex = -1;
            return stateCopy;

        case EVENT_BATTLE:
            stateCopy.battle = initialGameboardMeta.battle;
            stateCopy.battle.active = true;
            stateCopy.battle.friendlyPieces = (action as EventBattleAction).payload.friendlyPieces;
            stateCopy.battle.enemyPieces = (action as EventBattleAction).payload.enemyPieces;
            return stateCopy;

        case NO_MORE_EVENTS:
            // stateCopy = initialGameboardMeta; //gets rid of selected position/piece if there was one...
            // stateCopy.battle = initialGameboardMeta.battle;
            // stateCopy.refuel = initialGameboardMeta.refuel;  //these don't seem to work
            // stateCopy.container = initialGameboardMeta.container;
            stateCopy.battle = {
                isMinimized: false,
                active: false,
                selectedBattlePiece: -1,
                selectedBattlePieceIndex: -1, //helper to find the piece within the array
                masterRecord: null,
                friendlyPieces: [],
                enemyPieces: []
            };
            stateCopy.refuel = {
                isMinimized: false,
                active: false,
                selectedTankerPieceId: -1,
                selectedTankerPieceIndex: -1,
                tankers: [],
                aircraft: []
            };
            // stateCopy.container = initialGameboardMeta.container;
            return stateCopy;

        case BATTLE_FIGHT_RESULTS:
            stateCopy.battle.masterRecord = (action as BattleResultsAction).payload.masterRecord;

            //now need more stuff handled for things...
            for (let x = 0; x < stateCopy.battle.friendlyPieces.length; x++) {
                //already knew the targets...
                //which ones win or not gets handled

                let currentRecord = (action as BattleResultsAction).payload.masterRecord.find((record: any, index: any) => {
                    return record.pieceId === stateCopy.battle.friendlyPieces[x].piece.pieceId;
                });

                let { targetId, diceRoll, win, diceRoll1, diceRoll2 } = currentRecord;

                if (targetId) {
                    stateCopy.battle.friendlyPieces[x].diceRoll = diceRoll;
                    stateCopy.battle.friendlyPieces[x].win = win;
                    stateCopy.battle.friendlyPieces[x].diceRoll1 = diceRoll1;
                    stateCopy.battle.friendlyPieces[x].diceRoll2 = diceRoll2;
                }
            }

            for (let z = 0; z < stateCopy.battle.enemyPieces.length; z++) {
                //for each enemy piece that know (from battle.enemyPieces)
                //add their target/dice information?

                //every piece should have a record from the battle, even if it didn't do anything... (things will be null...(reference Event.js))
                let currentRecord = (action as BattleResultsAction).payload.masterRecord.find((record: any, index: number) => {
                    return record.pieceId === stateCopy.battle.enemyPieces[z].piece.pieceId;
                });

                let { pieceId, targetId, diceRoll, win, diceRoll1, diceRoll2 } = currentRecord;

                if (targetId) {
                    //get the target information from the friendlyPieces
                    //TODO: could refactor this to be better, lots of lookups probably not good
                    let friendlyPieceIndex = stateCopy.battle.friendlyPieces.findIndex(
                        (friendlyBattlePiece: any) => friendlyBattlePiece.piece.pieceId === targetId
                    );
                    let friendlyPiece = stateCopy.battle.friendlyPieces[friendlyPieceIndex];
                    let enemyPieceIndex = stateCopy.battle.enemyPieces.findIndex(
                        (enemyBattlePiece: any) => enemyBattlePiece.piece.pieceId === pieceId
                    );
                    stateCopy.battle.enemyPieces[enemyPieceIndex].targetPiece = friendlyPiece.piece;
                    stateCopy.battle.enemyPieces[enemyPieceIndex].targetPieceIndex = friendlyPieceIndex;
                    stateCopy.battle.enemyPieces[enemyPieceIndex].win = win;
                    stateCopy.battle.enemyPieces[enemyPieceIndex].diceRoll = diceRoll;
                    stateCopy.battle.enemyPieces[enemyPieceIndex].diceRoll1 = diceRoll1;
                    stateCopy.battle.enemyPieces[enemyPieceIndex].diceRoll2 = diceRoll2;
                }
            }

            return stateCopy;

        case CLEAR_BATTLE:
            //probably a more efficient way of removing elements from the master record/friendlyPieces/enemyPieces
            for (let z = 0; z < stateCopy.battle.masterRecord.length; z++) {
                let thisRecord = stateCopy.battle.masterRecord[z];
                if (thisRecord.targetId && thisRecord.win) {
                    //need to delete that targetId from friendlyList or enemyList
                    stateCopy.battle.friendlyPieces = stateCopy.battle.friendlyPieces.filter((battlePiece: any) => {
                        return battlePiece.piece.pieceId !== thisRecord.targetId;
                    });
                    stateCopy.battle.enemyPieces = stateCopy.battle.enemyPieces.filter((battlePiece: any) => {
                        return battlePiece.piece.pieceId !== thisRecord.targetId;
                    });
                }
            }

            for (let x = 0; x < stateCopy.battle.friendlyPieces.length; x++) {
                //for each friendly piece, clear the dice roll and other stuff
                stateCopy.battle.friendlyPieces[x].targetPiece = null;
                stateCopy.battle.friendlyPieces[x].targetPieceIndex = -1;
                delete stateCopy.battle.friendlyPieces[x].diceRoll;
                delete stateCopy.battle.friendlyPieces[x].win;
            }
            for (let x = 0; x < stateCopy.battle.enemyPieces.length; x++) {
                //for each friendly piece, clear the dice roll and other stuff
                stateCopy.battle.enemyPieces[x].targetPiece = null;
                stateCopy.battle.enemyPieces[x].targetPieceIndex = -1;
                delete stateCopy.battle.enemyPieces[x].diceRoll;
                delete stateCopy.battle.enemyPieces[x].win;
            }

            delete stateCopy.battle.masterRecord;

            return stateCopy;

        default:
            return state;
    }
}

export default gameboardMetaReducer;
