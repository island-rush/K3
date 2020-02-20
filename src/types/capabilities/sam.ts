import { PieceType } from '../databaseTables';

export const SAM_DELETED_PIECES = 'SAM_DELETED_PIECES';
export type SamDeletedPiecesAction = {
    type: typeof SAM_DELETED_PIECES;
    payload: {
        listOfDeletedPieces: PieceType[];
    };
};

export const CLEAR_SAM_DELETE = 'CLEAR_SAM_DELETE';
export type ClearSamDeleteAction = {
    type: typeof CLEAR_SAM_DELETE;
    payload: {
        listOfDeletedPieces: PieceType[];
    };
};
