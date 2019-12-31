import { AnyAction } from 'redux';
// prettier-ignore
import { AIRCRAFT_CLICK, EVENT_REFUEL, INITIAL_GAMESTATE, NO_MORE_EVENTS, REFUELPOPUP_MINIMIZE_TOGGLE, REFUEL_RESULTS, TANKER_CLICK, TYPE_FUEL, UNDO_FUEL_SELECTION } from '../../../../constants';
// prettier-ignore
import { AircraftClickAction, EventRefuelAction, GameInitialStateAction, RefuelState, TankerClickAction, UndoFuelSelectionAction } from '../../../../types';

const initialRefuelState: RefuelState = {
    isMinimized: false,
    active: false,
    selectedTankerPieceId: -1,
    selectedTankerPieceIndex: -1,
    tankers: [],
    aircraft: []
};

export function refuelReducer(state = initialRefuelState, action: AnyAction) {
    const { type } = action;

    let stateCopy: RefuelState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            //TODO: refactor to not do this
            Object.assign(stateCopy, (action as GameInitialStateAction).payload.gameboardMeta);
            return stateCopy;

        case TANKER_CLICK:
            //select if different, unselect if was the same
            let lastSelectedTankerId = stateCopy.selectedTankerPieceId;
            stateCopy.selectedTankerPieceId =
                (action as TankerClickAction).payload.tankerPiece.pieceId === lastSelectedTankerId
                    ? -1
                    : (action as TankerClickAction).payload.tankerPiece.pieceId;
            stateCopy.selectedTankerPieceIndex =
                (action as TankerClickAction).payload.tankerPiece.pieceId === lastSelectedTankerId
                    ? -1
                    : (action as TankerClickAction).payload.tankerPieceIndex;
            return stateCopy;

        case AIRCRAFT_CLICK:
            //show which tanker is giving the aircraft...
            let { aircraftPieceIndex, aircraftPiece } = (action as AircraftClickAction).payload;
            const { selectedTankerPieceId, selectedTankerPieceIndex } = stateCopy;

            stateCopy.aircraft[aircraftPieceIndex].tankerPieceId = selectedTankerPieceId;
            stateCopy.aircraft[aircraftPieceIndex].tankerPieceIndex = selectedTankerPieceIndex;

            //need how much fuel is getting removed
            const fuelToRemove = TYPE_FUEL[aircraftPiece.pieceTypeId] - aircraftPiece.pieceFuel;

            if (!stateCopy.tankers[selectedTankerPieceIndex].removedFuel) {
                stateCopy.tankers[selectedTankerPieceIndex].removedFuel = 0;
            }
            stateCopy.tankers[selectedTankerPieceIndex].removedFuel += fuelToRemove;

            return stateCopy;

        case UNDO_FUEL_SELECTION:
            //TODO: needs some good refactoring
            // let airPiece = payload.aircraftPiece;
            let airPieceIndex = (action as UndoFuelSelectionAction).payload.aircraftPieceIndex;
            let tankerPieceIndex2 = stateCopy.aircraft[airPieceIndex].tankerPieceIndex;

            let pieceType = stateCopy.aircraft[airPieceIndex].pieceTypeId;
            let fuelThatWasGoingToGetAdded = TYPE_FUEL[pieceType] - stateCopy.aircraft[airPieceIndex].pieceFuel;

            stateCopy.aircraft[airPieceIndex].tankerPieceId = null;
            stateCopy.aircraft[airPieceIndex].tankerPieceIndex = null;
            stateCopy.tankers[tankerPieceIndex2].removedFuel -= fuelThatWasGoingToGetAdded;
            return stateCopy;

        case REFUEL_RESULTS:
            return initialRefuelState;

        case EVENT_REFUEL:
            stateCopy.active = true;
            stateCopy.tankers = (action as EventRefuelAction).payload.tankers;
            stateCopy.aircraft = (action as EventRefuelAction).payload.aircraft;
            stateCopy.selectedTankerPieceId = -1;
            stateCopy.selectedTankerPieceIndex = -1;
            return stateCopy;

        case REFUELPOPUP_MINIMIZE_TOGGLE:
            stateCopy.isMinimized = !stateCopy.isMinimized;
            return stateCopy;

        case NO_MORE_EVENTS:
            stateCopy = {
                isMinimized: false,
                active: false,
                selectedTankerPieceId: -1,
                selectedTankerPieceIndex: -1,
                tankers: [],
                aircraft: []
            };
            return stateCopy;

        default:
            return state;
    }
}

export default refuelReducer;
