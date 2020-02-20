import { InvItemType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const INSURGENCY_SELECTING = 'INSURGENCY_SELECTING';
export type InsurgencySelectingAction = {
    type: typeof INSURGENCY_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_INSURGENCY_CONFIRM = 'SERVER_INSURGENCY_CONFIRM';
export type InsurgencyRequestAction = {
    type: typeof SERVER_INSURGENCY_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const INSURGENCY_SELECTED = 'INSURGENCY_SELECTED';
export type InsurgencyAction = {
    type: typeof INSURGENCY_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};
