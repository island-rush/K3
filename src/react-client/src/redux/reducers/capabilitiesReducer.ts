import { AnyAction } from 'redux';
// prettier-ignore
import { BIO_WEAPON_SELECTED, COMM_INTERRUP_SELECTED, EVENT_BATTLE, EVENT_REFUEL, GOLDEN_EYE_SELECTED, INITIAL_GAMESTATE, INSURGENCY_SELECTED, NEW_ROUND, NO_MORE_EVENTS, PLACE_PHASE, RAISE_MORALE_SELECTED, REMOTE_SENSING_SELECTED, RODS_FROM_GOD_SELECTED, SLICE_CHANGE } from '../../../../constants';
// prettier-ignore
import { BioWeaponsAction, CapabilitiesState, CommInterruptAction, GameInitialStateAction, GoldenEyeAction, InsurgencyAction, NewRoundAction, PlacePhaseAction, RaiseMoraleAction, RemoteSensingAction, RodsFromGodAction, SliceChangeAction } from '../../../../types';

const initialCapabilitiesState: CapabilitiesState = {
    confirmedRods: [],
    confirmedRemoteSense: [],
    confirmedInsurgency: [],
    confirmedBioWeapons: [],
    confirmedRaiseMorale: [],
    confirmedCommInterrupt: [],
    confirmedGoldenEye: []
};

export function capabilitiesReducer(state = initialCapabilitiesState, action: AnyAction) {
    const { type } = action;

    let stateCopy: CapabilitiesState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            Object.assign(stateCopy, (action as GameInitialStateAction).payload.capabilities);
            return stateCopy;

        case NEW_ROUND:
            stateCopy.confirmedRods = [];
            stateCopy.confirmedInsurgency = [];
            stateCopy.confirmedRemoteSense = (action as NewRoundAction).payload.confirmedRemoteSense;
            stateCopy.confirmedGoldenEye = (action as NewRoundAction).payload.confirmedGoldenEye;
            stateCopy.confirmedBioWeapons = (action as NewRoundAction).payload.confirmedBioWeapons;
            stateCopy.confirmedCommInterrupt = (action as NewRoundAction).payload.confirmedCommInterrupt;
            return stateCopy;

        case PLACE_PHASE:
            stateCopy.confirmedRemoteSense = (action as PlacePhaseAction).payload.confirmedRemoteSense;
            stateCopy.confirmedGoldenEye = (action as PlacePhaseAction).payload.confirmedGoldenEye;
            stateCopy.confirmedBioWeapons = (action as PlacePhaseAction).payload.confirmedBioWeapons;
            stateCopy.confirmedCommInterrupt = (action as PlacePhaseAction).payload.confirmedCommInterrupt;
            return stateCopy;

        case RAISE_MORALE_SELECTED:
            stateCopy.confirmedRaiseMorale = (action as RaiseMoraleAction).payload.confirmedRaiseMorale;
            return stateCopy;

        case RODS_FROM_GOD_SELECTED:
            stateCopy.confirmedRods.push((action as RodsFromGodAction).payload.selectedPositionId);
            return stateCopy;

        case BIO_WEAPON_SELECTED:
            stateCopy.confirmedBioWeapons.push((action as BioWeaponsAction).payload.selectedPositionId);
            return stateCopy;

        case COMM_INTERRUP_SELECTED:
            stateCopy.confirmedCommInterrupt = (action as CommInterruptAction).payload.confirmedCommInterrupt;
            return stateCopy;

        case INSURGENCY_SELECTED:
            stateCopy.confirmedInsurgency.push((action as InsurgencyAction).payload.selectedPositionId);
            return stateCopy;

        case REMOTE_SENSING_SELECTED:
            stateCopy.confirmedRemoteSense = (action as RemoteSensingAction).payload.confirmedRemoteSense;
            return stateCopy;

        case GOLDEN_EYE_SELECTED:
            stateCopy.confirmedGoldenEye.push((action as GoldenEyeAction).payload.selectedPositionId);
            return stateCopy;

        case SLICE_CHANGE:
            stateCopy.confirmedRods = (action as SliceChangeAction).payload.confirmedRods;
            stateCopy.confirmedBioWeapons = (action as SliceChangeAction).payload.confirmedBioWeapons;
            stateCopy.confirmedCommInterrupt = (action as SliceChangeAction).payload.confirmedCommInterrupt;
            stateCopy.confirmedInsurgency = (action as SliceChangeAction).payload.confirmedInsurgencyPos;
            stateCopy.confirmedGoldenEye = (action as SliceChangeAction).payload.confirmedGoldenEye;
            return stateCopy;

        case EVENT_BATTLE:
        case NO_MORE_EVENTS:
        case EVENT_REFUEL:
            stateCopy.confirmedRods = [];
            stateCopy.confirmedInsurgency = [];
            return stateCopy;

        default:
            return state;
    }
}

export default capabilitiesReducer;
