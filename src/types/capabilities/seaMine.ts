import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { InvItemType, PieceType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const SEA_MINE_SELECTING = 'SEA_MINE_SELECTING';
export type SeaMineSelectingAction = {
    type: typeof SEA_MINE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_SEA_MINE_CONFIRM = 'SERVER_SEA_MINE_CONFIRM';
export type SeaMineRequestAction = {
    type: typeof SERVER_SEA_MINE_CONFIRM;
    payload: {
        selectedPiece: PieceType;
        invItem: InvItemType;
    };
};

export const SEA_MINE_SELECTED = 'SEA_MINE_SELECTED';
export type SeaMineAction = {
    type: typeof SEA_MINE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const SEA_MINE_HIT_NOTIFICATION = 'SEA_MINE_HIT_NOTIFICATION';
export type SeaMineHitNotifyAction = {
    type: typeof SEA_MINE_HIT_NOTIFICATION;
    payload: {
        positionsToHighlight: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const SEA_MINE_NOTIFY_CLEAR = 'SEA_MINE_NOTIFY_CLEAR';
export type ClearSeaMineNotifyAction = {
    type: typeof SEA_MINE_NOTIFY_CLEAR;
    payload: {};
};
