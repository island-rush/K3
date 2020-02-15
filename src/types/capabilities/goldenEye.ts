import { InvItemType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const GOLDEN_EYE_SELECTING = 'GOLDEN_EYE_SELECTING';
export type GoldenEyeSelectingAction = {
    type: typeof GOLDEN_EYE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_GOLDEN_EYE_CONFIRM = 'SERVER_GOLDEN_EYE_CONFIRM';
export type GoldenEyeRequestAction = {
    type: typeof SERVER_GOLDEN_EYE_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const GOLDEN_EYE_SELECTED = 'GOLDEN_EYE_SELECTED';
export type GoldenEyeAction = {
    type: typeof GOLDEN_EYE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};
