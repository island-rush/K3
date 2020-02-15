import { InvItemType, PieceType } from '../databaseTables';

export const PIECE_PLACE_START = 'PIECE_PLACE_START';
export type PiecePlaceStartAction = {
    type: typeof PIECE_PLACE_START;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_PIECE_PLACE = 'SERVER_PIECE_PLACE';
export type InvItemPlaceRequestAction = {
    type: typeof SERVER_PIECE_PLACE;
    payload: {
        invItemId: InvItemType['invItemId'];
        selectedPosition: PieceType['piecePositionId'];
    };
};

export const PIECE_PLACE = 'PIECE_PLACE';
export type InvItemPlaceAction = {
    type: typeof PIECE_PLACE;
    payload: {
        invItem: InvItemType;
        positionId: PieceType['piecePositionId'];
        newPiece: PieceType;
    };
};
