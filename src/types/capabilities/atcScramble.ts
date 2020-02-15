import { InvItemType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const ATC_SCRAMBLE_SELECTING = 'ATC_SCRAMBLE_SELECTING';
export type AtcScrambleSelectingAction = {
    type: typeof ATC_SCRAMBLE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_ATC_SCRAMBLE_CONFIRM = 'SERVER_ATC_SCRAMBLE_CONFIRM';
export type AtcScrambleRequestAction = {
    type: typeof SERVER_ATC_SCRAMBLE_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const ATC_SCRAMBLE_SELECTED = 'ATC_SCRAMBLE_SELECTED';
export type AtcScrambleAction = {
    type: typeof ATC_SCRAMBLE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};
