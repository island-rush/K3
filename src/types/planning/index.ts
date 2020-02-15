import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { PieceType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const START_PLAN = 'START_PLAN';
export type StartPlanAction = {
    type: typeof START_PLAN;
    payload: {};
};

export const CANCEL_PLAN = 'CANCEL_PLAN';
export type PreventPlanAction = {
    type: typeof CANCEL_PLAN;
    payload: {};
};

export const SERVER_CONFIRM_PLAN = 'SERVER_CONFIRM_PLAN';
export type ConfirmPlanRequestAction = {
    type: typeof SERVER_CONFIRM_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
        plan: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const PLANNING_SELECT = 'PLANNING_SELECT';
export type PlanningSelectAction = {
    type: typeof PLANNING_SELECT;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const PLAN_WAS_CONFIRMED = 'PLAN_WAS_CONFIRMED';
export type ConfirmPlanAction = {
    type: typeof PLAN_WAS_CONFIRMED;
    payload: {
        pieceId: PieceType['pieceId'];
        plan: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const DELETE_PLAN = 'DELETE_PLAN';
export type DeletePlanAction = {
    type: typeof DELETE_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
    };
};

export const SERVER_DELETE_PLAN = 'SERVER_DELETE_PLAN';
export type DeletePlanRequestAction = {
    type: typeof SERVER_DELETE_PLAN;
    payload: {
        pieceId: PieceType['pieceId'];
    };
};

export const UNDO_MOVE = 'UNDO_MOVE';
export type UndoMoveAction = {
    type: typeof UNDO_MOVE;
    payload: {};
};
