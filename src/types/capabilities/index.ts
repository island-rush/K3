// prettier-ignore
import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { GameboardPiecesDataType } from '../board';
import { InvItemType, PieceType } from '../databaseTables';
import { CapabilitiesState, GameboardMetaState } from '../reducerTypes';
import { ControllerType } from '../sessionTypes';

export const SEA_MINE_HIT_NOTIFICATION = 'SEA_MINE_HIT_NOTIFICATION';
export type SeaMineHitNotifyAction = {
    type: typeof SEA_MINE_HIT_NOTIFICATION;
    payload: {
        positionsToHighlight: LIST_ALL_POSITIONS_TYPE[];
    };
};

export const SEA_MINE_NOTIFY_CLEAR = 'SEA_MINE_NOTIFY_CLEAR';
export type ClearSeaMineNotifyAction = {
    type: typeof SEA_MINE_NOTIFY_CLEAR;
    payload: {};
};

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

export const RODS_FROM_GOD_SELECTING = 'RODS_FROM_GOD_SELECTING';
export type RodsFromGodSelectingAction = {
    type: typeof RODS_FROM_GOD_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const RODS_FROM_GOD_SELECTED = 'RODS_FROM_GOD_SELECTED';
export type RodsFromGodAction = {
    type: typeof RODS_FROM_GOD_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const INSURGENCY_SELECTING = 'INSURGENCY_SELECTING';
export type InsurgencySelectingAction = {
    type: typeof INSURGENCY_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const INSURGENCY_SELECTED = 'INSURGENCY_SELECTED';
export type InsurgencyAction = {
    type: typeof INSURGENCY_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const BIO_WEAPON_SELECTING = 'BIO_WEAPON_SELECTING';
export type BioWeaponSelectingAction = {
    type: typeof BIO_WEAPON_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const BIO_WEAPON_SELECTED = 'BIO_WEAPON_SELECTED';
export type BioWeaponsAction = {
    type: typeof BIO_WEAPON_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const REMOTE_SENSING_SELECTING = 'REMOTE_SENSING_SELECTING';
export type RemoteSenseSelectingAction = {
    type: typeof REMOTE_SENSING_SELECTING;
    payload: {
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

export const RAISE_MORALE_SELECTING = 'RAISE_MORALE_SELECTING';
export type RaiseMoraleSelectingAction = {
    type: typeof RAISE_MORALE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const RAISE_MORALE_SELECTED = 'RAISE_MORALE_SELECTED';
export type RaiseMoraleAction = {
    type: typeof RAISE_MORALE_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        gameboardPieces: GameboardPiecesDataType;
    };
};

export const COMM_INTERRUPT_SELECTING = 'COMM_INTERRUPT_SELECTING';
export type CommInterruptSelectingAction = {
    type: typeof COMM_INTERRUPT_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

// TODO: typo fix
export const COMM_INTERRUP_SELECTED = 'COMM_INTERRUPT_SELECTED';
export type CommInterruptAction = {
    type: typeof COMM_INTERRUP_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
    };
};

export const GOLDEN_EYE_SELECTING = 'GOLDEN_EYE_SELECTING';
export type GoldenEyeSelectingAction = {
    type: typeof GOLDEN_EYE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const GOLDEN_EYE_SELECTED = 'GOLDEN_EYE_SELECTED';
export type GoldenEyeAction = {
    type: typeof GOLDEN_EYE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const SEA_MINE_SELECTING = 'SEA_MINE_SELECTING';
export type SeaMineSelectingAction = {
    type: typeof SEA_MINE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const SEA_MINE_SELECTED = 'SEA_MINE_SELECTED';
export type SeaMineAction = {
    type: typeof SEA_MINE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const MISSILE_SELECTING = 'MISSILE_SELECTING';
export type MissileSelectingAction = {
    type: typeof MISSILE_SELECTING;
    payload: {
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

export const MISSILE_DISRUPT_SELECTED = 'MISSILE_DISRUPT_SELECTED';
export type MissileDisruptAction = {
    type: typeof MISSILE_DISRUPT_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPiece: PieceType;
    };
};

export const MISSILE_DISRUPT_SELECTING = 'MISSILE_DISRUPT_SELECTING';
export type MissileDisruptSelectingAction = {
    type: typeof MISSILE_DISRUPT_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const BOMBARDMENT_SELECTING = 'BOMBARDMENT_SELECTING';
export type BombardmentSelectingAction = {
    type: typeof BOMBARDMENT_SELECTING;
    payload: {
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

export const NUKE_SELECTING = 'NUKE_SELECTING';
export type NukeSelectingAction = {
    type: typeof NUKE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const NUKE_SELECTED = 'NUKE_SELECTED';
export type NukeAction = {
    type: typeof NUKE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const ANTISAT_HIT_ACTION = 'ANTISAT_HIT_ACTION';
export type AntiSatHitAction = {
    type: typeof ANTISAT_HIT_ACTION;
    payload: {
        positionOfRemoteHit: LIST_ALL_POSITIONS_TYPE;
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

export const ANTISAT_SELECTED = 'ANTISAT_SELECTED';
export type AntiSatAction = {
    type: typeof ANTISAT_SELECTED;
    payload: {
        invItem: InvItemType;
    };
};

export const DRONE_SWARM_SELECTING = 'DRONE_SWARM_SELECTING';
export type DroneSwarmSelectingAction = {
    type: typeof DRONE_SWARM_SELECTING;
    payload: {
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

export const ATC_SCRAMBLE_SELECTED = 'ATC_SCRAMBLE_SELECTED';
export type AtcScrambleAction = {
    type: typeof ATC_SCRAMBLE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const ATC_SCRAMBLE_SELECTING = 'ATC_SCRAMBLE_SELECTING';
export type AtcScrambleSelectingAction = {
    type: typeof ATC_SCRAMBLE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
};

export const CYBER_DEFENSE_SELECTED = 'CYBER_DEFENSE_SELECTED';
export type CyberDefenseAction = {
    type: typeof CYBER_DEFENSE_SELECTED;
    payload: {
        invItem: InvItemType;
    };
};

export const CYBER_DEFENSE_CHECK = 'CYBER_DEFENSE_CHECK';
export type CyberDefenseCheckAction = {
    type: typeof CYBER_DEFENSE_CHECK;
    payload: {
        isActive: boolean;
        invItem: InvItemType;
    };
};

export const SERVER_CYBER_DEFENSE_CHECK = 'SERVER_CYBER_DEFENSE_CHECK';
export type CyberDefenseCheckRequest = {
    type: typeof SERVER_CYBER_DEFENSE_CHECK;
    payload: {
        invItem: InvItemType;
    };
};

export const SERVER_RODS_FROM_GOD_CONFIRM = 'SERVER_RODS_FROM_GOD_CONFIRM';
export type RodsFromGodRequestAction = {
    type: typeof SERVER_RODS_FROM_GOD_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
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

export const SERVER_INSURGENCY_CONFIRM = 'SERVER_INSURGENCY_CONFIRM';
export type InsurgencyRequestAction = {
    type: typeof SERVER_INSURGENCY_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const SERVER_BIOLOGICAL_WEAPONS_CONFIRM = 'SERVER_BIOLOGICAL_WEAPONS_CONFIRM';
export type BioWeaponsRequestAction = {
    type: typeof SERVER_BIOLOGICAL_WEAPONS_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const SERVER_RAISE_MORALE_CONFIRM = 'SERVER_RAISE_MORALE_CONFIRM';
export type RaiseMoraleRequestAction = {
    type: typeof SERVER_RAISE_MORALE_CONFIRM;
    payload: {
        selectedCommanderType: ControllerType;
        invItem: InvItemType;
    };
};

export const SERVER_COMM_INTERRUPT_CONFIRM = 'SERVER_COMM_INTERRUPT_CONFIRM';
export type CommInterruptRequestAction = {
    type: typeof SERVER_COMM_INTERRUPT_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const SERVER_GOLDEN_EYE_CONFIRM = 'SERVER_GOLDEN_EYE_CONFIRM';
export type GoldenEyeRequestAction = {
    type: typeof SERVER_GOLDEN_EYE_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const SERVER_SEA_MINE_CONFIRM = 'SERVER_SEA_MINE_CONFIRM';
export type SeaMineRequestAction = {
    type: typeof SERVER_SEA_MINE_CONFIRM;
    payload: {
        selectedPiece: PieceType;
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

export const SERVER_ATC_SCRAMBLE_CONFIRM = 'SERVER_ATC_SCRAMBLE_CONFIRM';
export type AtcScrambleRequestAction = {
    type: typeof SERVER_ATC_SCRAMBLE_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
    };
};

export const SERVER_NUKE_CONFIRM = 'SERVER_NUKE_CONFIRM';
export type NukeRequestAction = {
    type: typeof SERVER_NUKE_CONFIRM;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
        invItem: InvItemType;
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

export const SERVER_BOMBARDMENT_CONFIRM = 'SERVER_BOMBARDMENT_CONFIRM';
export type BombardmentRequestAction = {
    type: typeof SERVER_BOMBARDMENT_CONFIRM;
    payload: {
        selectedTargetPiece: PieceType;
        selectedPiece: PieceType;
    };
};

export const SERVER_ANTISAT_CONFIRM = 'SERVER_ANTISAT_CONFIRM';
export type AntiSatRequestAction = {
    type: typeof SERVER_ANTISAT_CONFIRM;
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

export const SERVER_CYBER_DEFENSE_CONFIRM = 'SERVER_CYBER_DEFENSE_CONFIRM';
export type CyberDefenseRequestAction = {
    type: typeof SERVER_CYBER_DEFENSE_CONFIRM;
    payload: {
        invItem: InvItemType;
    };
};
