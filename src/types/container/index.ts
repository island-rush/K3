import { GameboardPiecesDataType } from '../board';
import { PieceType } from '../databaseTables';
import { GameboardMetaState, GameboardState } from '../reducerTypes';

export const PIECE_OPEN_ACTION = 'PIECE_OPEN_ACTION';
export type PieceOpenAction = {
    type: typeof PIECE_OPEN_ACTION;
    payload: {
        selectedPiece: PieceType;
        gameboard: GameboardState;
    };
};

export const PIECE_CLOSE_ACTION = 'PIECE_CLOSE_ACTION';
export type PieceCloseAction = {
    type: typeof PIECE_CLOSE_ACTION;
    payload: {
        selectedPiece: PieceType;
    };
};

export const INNER_PIECE_CLICK_ACTION = 'INNER_PIECE_CLICK_ACTION';
export type ExitContainerAction = {
    type: typeof INNER_PIECE_CLICK_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const OUTER_PIECE_CLICK_ACTION = 'OUTER_PIECE_CLICK_ACTION';
export type EnterContainerAction = {
    type: typeof OUTER_PIECE_CLICK_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const INNER_TRANSPORT_PIECE_CLICK_ACTION = 'INNER_TRANSPORT_PIECE_CLICK_ACTION';
export type ExitTransportContainerAction = {
    type: typeof INNER_TRANSPORT_PIECE_CLICK_ACTION;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const SERVER_INNER_PIECE_CLICK = 'SERVER_INNER_PIECE_CLICK';
export type ExitContainerRequestAction = {
    type: typeof SERVER_INNER_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};

export const SERVER_INNER_TRANSPORT_PIECE_CLICK = 'SERVER_INNER_TRANSPORT_PIECE_CLICK';
export type ExitTransportContainerRequestAction = {
    type: typeof SERVER_INNER_TRANSPORT_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const SERVER_OUTER_PIECE_CLICK = 'SERVER_OUTER_PIECE_CLICK';
export type EnterContainerRequestAction = {
    type: typeof SERVER_OUTER_PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
        containerPiece: PieceType;
    };
};
