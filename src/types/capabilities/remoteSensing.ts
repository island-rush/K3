import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { GameboardPiecesDataType } from '../board';
import { InvItemType } from '../databaseTables';
import { CapabilitiesState, GameboardMetaState } from '../reducerTypes';

export const REMOTE_SENSING_SELECTING = 'REMOTE_SENSING_SELECTING';
export type RemoteSenseSelectingAction = {
    type: typeof REMOTE_SENSING_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_REMOTE_SENSING_CONFIRM = 'SERVER_REMOTE_SENSING_CONFIRM';
export type RemoteSensingRequestAction = {
    type: typeof SERVER_REMOTE_SENSING_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const REMOTE_SENSING_SELECTED = 'REMOTE_SENSING_SELECTED';
export type RemoteSensingAction = {
    type: typeof REMOTE_SENSING_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRemoteSense: CapabilitiesState['confirmedRemoteSense'];
        gameboardPieces: GameboardPiecesDataType;
    };
};

export const REMOTE_SENSING_HIT_ACTION = 'REMOTE_SENSING_HIT_ACTION';
export type RemoteSensingHitAction = {
    type: typeof REMOTE_SENSING_HIT_ACTION;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        positionOfRemoteHit: LIST_ALL_POSITIONS_TYPE;
    };
};
