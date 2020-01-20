// prettier-ignore
import { BIO_WEAPON_SELECTED, BIO_WEAPON_SELECTING, COMM_INTERRUPT_SELECTING, COMM_INTERRUP_SELECTED, DRONE_SWARM_SELECTED, GOLDEN_EYE_SELECTED, GOLDEN_EYE_SELECTING, INSURGENCY_SELECTED, INSURGENCY_SELECTING, RAISE_MORALE_SELECTED, RAISE_MORALE_SELECTING, REMOTE_SENSING_SELECTED, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTED, RODS_FROM_GOD_SELECTING, SEA_MINE_SELECTED, SEA_MINE_SELECTING, SERVER_BIOLOGICAL_WEAPONS_CONFIRM, SERVER_COMM_INTERRUPT_CONFIRM, SERVER_GOLDEN_EYE_CONFIRM, SERVER_INSURGENCY_CONFIRM, SERVER_RAISE_MORALE_CONFIRM, SERVER_REMOTE_SENSING_CONFIRM, SERVER_RODS_FROM_GOD_CONFIRM, SERVER_SEA_MINE_CONFIRM, DRONE_SWARM_SELECTING, SERVER_DRONE_SWARM_CONFIRM } from '../constants';
import { GameboardPiecesDataType } from './actionTypes';
import { InvItemType, PieceType } from './databaseTables';
import { CapabilitiesState, GameboardMetaState } from './reducerTypes';

export type RemoteSenseSelectingAction = {
    type: typeof REMOTE_SENSING_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type RaiseMoraleSelectingAction = {
    type: typeof RAISE_MORALE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type SeaMineSelectingAction = {
    type: typeof SEA_MINE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type DroneSwarmSelectingAction = {
    type: typeof DRONE_SWARM_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type BioWeaponSelectingAction = {
    type: typeof BIO_WEAPON_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type CommInterruptSelectingAction = {
    type: typeof COMM_INTERRUPT_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type GoldenEyeSelectingAction = {
    type: typeof GOLDEN_EYE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type InsurgencySelectingAction = {
    type: typeof INSURGENCY_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type RodsFromGodSelectingAction = {
    type: typeof RODS_FROM_GOD_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export type RodsFromGodRequestAction = {
    type: typeof SERVER_RODS_FROM_GOD_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export type SeaMineRequestAction = {
    type: typeof SERVER_SEA_MINE_CONFIRM;
    payload: {
        selectedPiece: PieceType;
        invItem: InvItemType;
    };
};

export type DroneSwarmRequestAction = {
    type: typeof SERVER_DRONE_SWARM_CONFIRM;
    payload: {
        selectedPiece: PieceType;
        invItem: InvItemType;
    };
};

export type RodsFromGodAction = {
    type: typeof RODS_FROM_GOD_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export type RemoteSensingRequestAction = {
    type: typeof SERVER_REMOTE_SENSING_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export type RemoteSensingAction = {
    type: typeof REMOTE_SENSING_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRemoteSense: CapabilitiesState['confirmedRemoteSense'];
        gameboardPieces: GameboardPiecesDataType;
    };
};

export type InsurgencyRequestAction = {
    type: typeof SERVER_INSURGENCY_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export type InsurgencyAction = {
    type: typeof INSURGENCY_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export type SeaMineAction = {
    type: typeof SEA_MINE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export type DroneSwarmAction = {
    type: typeof DRONE_SWARM_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export type BioWeaponsRequestAction = {
    type: typeof SERVER_BIOLOGICAL_WEAPONS_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export type BioWeaponsAction = {
    type: typeof BIO_WEAPON_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export type RaiseMoraleRequestAction = {
    type: typeof SERVER_RAISE_MORALE_CONFIRM;
    payload: {
        selectedCommanderType: number;
        invItem: InvItemType;
    };
};

export type RaiseMoraleAction = {
    type: typeof RAISE_MORALE_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        gameboardPieces: GameboardPiecesDataType;
    };
};

export type CommInterruptRequestAction = {
    type: typeof SERVER_COMM_INTERRUPT_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export type CommInterruptAction = {
    type: typeof COMM_INTERRUP_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
    };
};

export type GoldenEyeRequestAction = {
    type: typeof SERVER_GOLDEN_EYE_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export type GoldenEyeAction = {
    type: typeof GOLDEN_EYE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};
