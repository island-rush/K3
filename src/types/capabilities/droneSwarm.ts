import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { InvItemType, PieceType } from '../databaseTables';
import { GameboardMetaState } from '../reducerTypes';

export const DRONE_SWARM_SELECTING = 'DRONE_SWARM_SELECTING';
export type DroneSwarmSelectingAction = {
    type: typeof DRONE_SWARM_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_DRONE_SWARM_CONFIRM = 'SERVER_DRONE_SWARM_CONFIRM';
export type DroneSwarmRequestAction = {
    type: typeof SERVER_DRONE_SWARM_CONFIRM;
    payload: {
        selectedPiece: PieceType;
        invItem: InvItemType;
    };
};

export const DRONE_SWARM_SELECTED = 'DRONE_SWARM_SELECTED';
export type DroneSwarmAction = {
    type: typeof DRONE_SWARM_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const DRONE_SWARM_HIT_NOTIFICATION = 'DRONE_SWARM_HIT_NOTIFICATION';
export type DroneSwarmHitNotifyAction = {
    type: typeof DRONE_SWARM_HIT_NOTIFICATION;
    payload: {
        positionsToHighlight: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const DRONE_SWARM_NOTIFY_CLEAR = 'DRONE_SWARM_NOTIFY_CLEAR';
export type ClearDroneSwarmMineNotifyAction = {
    type: typeof DRONE_SWARM_NOTIFY_CLEAR;
    payload: {};
};
