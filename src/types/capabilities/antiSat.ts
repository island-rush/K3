import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { InvItemType } from '../databaseTables';

export const SERVER_ANTISAT_CONFIRM = 'SERVER_ANTISAT_CONFIRM';
export type AntiSatRequestAction = {
    type: typeof SERVER_ANTISAT_CONFIRM;
    payload: {
        invItem: InvItemType;
    };
};

export const ANTISAT_SELECTED = 'ANTISAT_SELECTED';
export type AntiSatAction = {
    type: typeof ANTISAT_SELECTED;
    payload: {
        invItem: InvItemType;
    };
};

export const ANTISAT_HIT_ACTION = 'ANTISAT_HIT_ACTION';
export type AntiSatHitAction = {
    type: typeof ANTISAT_HIT_ACTION;
    payload: {
        positionOfRemoteHit: LIST_ALL_POSITIONS_TYPE;
    };
};
