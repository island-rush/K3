import { InvItemType } from '../databaseTables';
import { CapabilitiesState, GameboardMetaState } from '../reducerTypes';

export const COMM_INTERRUPT_SELECTING = 'COMM_INTERRUPT_SELECTING';
export type CommInterruptSelectingAction = {
    type: typeof COMM_INTERRUPT_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_COMM_INTERRUPT_CONFIRM = 'SERVER_COMM_INTERRUPT_CONFIRM';
export type CommInterruptRequestAction = {
    type: typeof SERVER_COMM_INTERRUPT_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

// TODO: typo fix
export const COMM_INTERRUP_SELECTED = 'COMM_INTERRUPT_SELECTED';
export type CommInterruptAction = {
    type: typeof COMM_INTERRUP_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
    };
};
