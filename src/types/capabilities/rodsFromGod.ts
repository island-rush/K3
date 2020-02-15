import { InvItemType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const RODS_FROM_GOD_SELECTING = 'RODS_FROM_GOD_SELECTING';
export type RodsFromGodSelectingAction = {
    type: typeof RODS_FROM_GOD_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_RODS_FROM_GOD_CONFIRM = 'SERVER_RODS_FROM_GOD_CONFIRM';
export type RodsFromGodRequestAction = {
    type: typeof SERVER_RODS_FROM_GOD_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const RODS_FROM_GOD_SELECTED = 'RODS_FROM_GOD_SELECTED';
export type RodsFromGodAction = {
    type: typeof RODS_FROM_GOD_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};
