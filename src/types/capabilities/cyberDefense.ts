import { InvItemType } from '../databaseTables';

export const SERVER_CYBER_DEFENSE_CONFIRM = 'SERVER_CYBER_DEFENSE_CONFIRM';
export type CyberDefenseRequestAction = {
    type: typeof SERVER_CYBER_DEFENSE_CONFIRM;
    payload: {
        invItem: InvItemType;
    };
};

export const CYBER_DEFENSE_SELECTED = 'CYBER_DEFENSE_SELECTED';
export type CyberDefenseAction = {
    type: typeof CYBER_DEFENSE_SELECTED;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_CYBER_DEFENSE_CHECK = 'SERVER_CYBER_DEFENSE_CHECK';
export type CyberDefenseCheckRequest = {
    type: typeof SERVER_CYBER_DEFENSE_CHECK;
    payload: {
        invItem: InvItemType;
    };
};

export const CYBER_DEFENSE_CHECK = 'CYBER_DEFENSE_CHECK';
export type CyberDefenseCheckAction = {
    type: typeof CYBER_DEFENSE_CHECK;
    payload: {
        isActive: boolean;
        invItem: InvItemType;
    };
};
