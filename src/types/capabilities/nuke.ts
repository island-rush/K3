import { InvItemType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const NUKE_SELECTING = 'NUKE_SELECTING';
export type NukeSelectingAction = {
    type: typeof NUKE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_NUKE_CONFIRM = 'SERVER_NUKE_CONFIRM';
export type NukeRequestAction = {
    type: typeof SERVER_NUKE_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const NUKE_SELECTED = 'NUKE_SELECTED';
export type NukeAction = {
    type: typeof NUKE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};
