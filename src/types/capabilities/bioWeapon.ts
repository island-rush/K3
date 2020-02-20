import { InvItemType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const BIO_WEAPON_SELECTING = 'BIO_WEAPON_SELECTING';
export type BioWeaponSelectingAction = {
    type: typeof BIO_WEAPON_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_BIOLOGICAL_WEAPONS_CONFIRM = 'SERVER_BIOLOGICAL_WEAPONS_CONFIRM';
export type BioWeaponsRequestAction = {
    type: typeof SERVER_BIOLOGICAL_WEAPONS_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const BIO_WEAPON_SELECTED = 'BIO_WEAPON_SELECTED';
export type BioWeaponsAction = {
    type: typeof BIO_WEAPON_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};
