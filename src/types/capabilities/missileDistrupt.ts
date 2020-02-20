import { InvItemType, PieceType } from '../databaseTables';

export const MISSILE_DISRUPT_SELECTING = 'MISSILE_DISRUPT_SELECTING';
export type MissileDisruptSelectingAction = {
    type: typeof MISSILE_DISRUPT_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_MISSILE_DISRUPT_CONFIRM = 'SERVER_MISSILE_DISRUPT_CONFIRM';
export type MissileDisruptRequestAction = {
    type: typeof SERVER_MISSILE_DISRUPT_CONFIRM;
    payload: {
        selectedPiece: PieceType;
        invItem: InvItemType;
    };
};

export const MISSILE_DISRUPT_SELECTED = 'MISSILE_DISRUPT_SELECTED';
export type MissileDisruptAction = {
    type: typeof MISSILE_DISRUPT_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPiece: PieceType;
    };
};
