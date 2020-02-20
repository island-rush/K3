import { PieceType } from '../databaseTables';

export const MISSILE_SELECTING = 'MISSILE_SELECTING';
export type MissileSelectingAction = {
    type: typeof MISSILE_SELECTING;
    payload: {
        selectedPiece: PieceType;
    };
};

export const SERVER_MISSILE_CONFIRM = 'SERVER_MISSILE_CONFIRM';
export type MissileRequestAction = {
    type: typeof SERVER_MISSILE_CONFIRM;
    payload: {
        selectedTargetPiece: PieceType;
        selectedPiece: PieceType;
    };
};

export const MISSILE_SELECTED = 'MISSILE_SELECTED';
export type MissileAction = {
    type: typeof MISSILE_SELECTED;
    payload: {
        selectedPiece: PieceType;
        selectedTargetPiece: PieceType;
    };
};
