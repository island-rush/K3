import { Action } from 'redux';
// prettier-ignore
import { REMOTE_SENSING_SELECTING, RAISE_MORALE_SELECTING, BIO_WEAPON_SELECTING, COMM_INTERRUPT_SELECTING, GOLDEN_EYE_SELECTING, INSURGENCY_SELECTING, RODS_FROM_GOD_SELECTING, SERVER_RODS_FROM_GOD_CONFIRM, RODS_FROM_GOD_SELECTED, SERVER_REMOTE_SENSING_CONFIRM, REMOTE_SENSING_SELECTED, SERVER_INSURGENCY_CONFIRM, INSURGENCY_SELECTED, SERVER_BIOLOGICAL_WEAPONS_CONFIRM, BIO_WEAPON_SELECTED, SERVER_RAISE_MORALE_CONFIRM, RAISE_MORALE_SELECTED, SERVER_COMM_INTERRUPT_CONFIRM, COMM_INTERRUP_SELECTED, SERVER_GOLDEN_EYE_CONFIRM, GOLDEN_EYE_SELECTED } from '../react-client/src/redux/actions/actionTypes';
import { InvItemType } from './classes';

export interface RemoteSenseSelectingAction extends Action {
    type: typeof REMOTE_SENSING_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface RaiseMoraleSelectingAction extends Action {
    type: typeof RAISE_MORALE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface BioWeaponSelectingAction extends Action {
    type: typeof BIO_WEAPON_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface CommInterruptSelectingAction extends Action {
    type: typeof COMM_INTERRUPT_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface GoldenEyeSelectingAction extends Action {
    type: typeof GOLDEN_EYE_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface InsurgencySelectingAction extends Action {
    type: typeof INSURGENCY_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface RodsFromGodSelectingAction extends Action {
    type: typeof RODS_FROM_GOD_SELECTING;
    payload: {
        invItem: InvItemType;
    };
}

export interface RodsFromGodRequestAction extends Action {
    type: typeof SERVER_RODS_FROM_GOD_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface RodsFromGodAction extends Action {
    type: typeof RODS_FROM_GOD_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: number;
    };
}

export interface RemoteSensingRequestAction extends Action {
    type: typeof SERVER_REMOTE_SENSING_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface RemoteSensingAction extends Action {
    type: typeof REMOTE_SENSING_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRemoteSense: any;
        gameboardPieces: any;
    };
}

export interface InsurgencyRequestAction extends Action {
    type: typeof SERVER_INSURGENCY_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface InsurgencyAction extends Action {
    type: typeof INSURGENCY_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: number;
    };
}

export interface BioWeaponsRequestAction extends Action {
    type: typeof SERVER_BIOLOGICAL_WEAPONS_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface BioWeaponsAction extends Action {
    type: typeof BIO_WEAPON_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: number;
    };
}

export interface RaiseMoraleRequestAction extends Action {
    type: typeof SERVER_RAISE_MORALE_CONFIRM;
    payload: {
        selectedCommanderType: number;
        invItem: InvItemType;
    };
}

export interface RaiseMoraleAction extends Action {
    type: typeof RAISE_MORALE_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedRaiseMorale: any;
        gameboardPieces: any;
    };
}

export interface CommInterruptRequestAction extends Action {
    type: typeof SERVER_COMM_INTERRUPT_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface CommInterruptAction extends Action {
    type: typeof COMM_INTERRUP_SELECTED;
    payload: {
        invItem: InvItemType;
        confirmedCommInterrupt: any;
    };
}

export interface GoldenEyeRequestAction extends Action {
    type: typeof SERVER_GOLDEN_EYE_CONFIRM;
    payload: {
        selectedPositionId: number;
        invItem: InvItemType;
    };
}

export interface GoldenEyeAction extends Action {
    type: typeof GOLDEN_EYE_SELECTED;
    payload: {
        invItem: InvItemType;
        selectedPositionId: number;
    };
}

export type PositionCapabilityRequestAction =
    | RodsFromGodRequestAction
    | RemoteSensingRequestAction
    | InsurgencyRequestAction
    | BioWeaponsRequestAction
    | CommInterruptRequestAction
    | GoldenEyeRequestAction;

export type InvItemCapabilityAction =
    | RodsFromGodAction
    | RemoteSensingAction
    | InsurgencyAction
    | BioWeaponsAction
    | RaiseMoraleAction
    | GoldenEyeAction
    | CommInterruptAction;
export type SelectingAction =
    | InsurgencySelectingAction
    | BioWeaponSelectingAction
    | CommInterruptSelectingAction
    | RodsFromGodSelectingAction
    | GoldenEyeSelectingAction
    | RemoteSenseSelectingAction;