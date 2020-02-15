import { PieceType } from '../databaseTables';
import { RefuelState } from '../reducerTypes';

export const REFUEL_OPEN = 'REFUEL_OPEN';
export type RefuelOpenAction = {
    type: typeof REFUEL_OPEN;
    payload: {
        aircraft: PieceType[];
        tankers: PieceType[];
    };
};

export const UNDO_FUEL_SELECTION = 'UNDO_FUEL_SELECTION';
export type UndoFuelSelectionAction = {
    type: typeof UNDO_FUEL_SELECTION;
    payload: {
        aircraftPiece: any;
        aircraftPieceIndex: number;
    };
};

export const REFUEL_RESULTS = 'REFUEL_RESULTS';
export type FuelResultsAction = {
    type: typeof REFUEL_RESULTS;
    payload: {
        fuelUpdates: {
            pieceId: PieceType['pieceId'];
            piecePositionId: PieceType['piecePositionId'];
            newFuel: PieceType['pieceFuel'];
        }[];
    };
};

export const REFUELPOPUP_MINIMIZE_TOGGLE = 'REFUELPOPUP_MINIMIZE_TOGGLE';
export type RefuelPopupToggleAction = {
    type: typeof REFUELPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export const TANKER_CLICK = 'TANKER_CLICK';
export type TankerClickAction = {
    type: typeof TANKER_CLICK;
    payload: {
        tankerPiece: any;
        tankerPieceIndex: number;
    };
};

export const AIRCRAFT_CLICK = 'AIRCRAFT_CLICK';
export type AircraftClickAction = {
    type: typeof AIRCRAFT_CLICK;
    payload: {
        aircraftPiece: any;
        aircraftPieceIndex: number;
    };
};

export const SERVER_CONFIRM_FUEL_SELECTION = 'SERVER_CONFIRM_FUEL_SELECTION';
export type ConfirmFuelSelectionRequestAction = {
    type: typeof SERVER_CONFIRM_FUEL_SELECTION;
    payload: {
        aircraft: RefuelState['aircraft'];
        tankers: RefuelState['tankers'];
    };
};
