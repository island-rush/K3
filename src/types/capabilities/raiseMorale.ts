import { GameboardPiecesDataType } from '../board';
import { InvItemType } from '../databaseTables';
import { CapabilitiesState } from '../reducerTypes';
import { ControllerType } from '../sessionTypes';

export const RAISE_MORALE_SELECTING = 'RAISE_MORALE_SELECTING';
export type RaiseMoraleSelectingAction = {
    type: typeof RAISE_MORALE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_RAISE_MORALE_CONFIRM = 'SERVER_RAISE_MORALE_CONFIRM';
export type RaiseMoraleRequestAction = {
    type: typeof SERVER_RAISE_MORALE_CONFIRM;
    payload: {
        selectedCommanderType: ControllerType;
        invItem: InvItemType;
    };
};

export const RAISE_MORALE_SELECTED = 'RAISE_MORALE_SELECTED';
export type RaiseMoraleAction = {
    type: typeof RAISE_MORALE_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        gameboardPieces: GameboardPiecesDataType;
    };
};
