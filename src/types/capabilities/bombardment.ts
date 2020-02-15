import { PieceType } from '../databaseTables';

export const BOMBARDMENT_SELECTING = 'BOMBARDMENT_SELECTING';
export type BombardmentSelectingAction = {
    type: typeof BOMBARDMENT_SELECTING;
    payload: {
        selectedPiece: PieceType;
    };
};

export const SERVER_BOMBARDMENT_CONFIRM = 'SERVER_BOMBARDMENT_CONFIRM';
export type BombardmentRequestAction = {
    type: typeof SERVER_BOMBARDMENT_CONFIRM;
    payload: {
        selectedTargetPiece: PieceType;
        selectedPiece: PieceType;
    };
};

export const BOMBARDMENT_SELECTED = 'BOMBARDMENT_SELECTED';
export type BombardmentAction = {
    type: typeof BOMBARDMENT_SELECTED;
    payload: {
        selectedPiece: PieceType;
        selectedTargetPiece: PieceType;
    };
};
