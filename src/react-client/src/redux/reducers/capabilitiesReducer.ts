// prettier-ignore
import { ANTISAT_HIT_ACTION, ANTISAT_SELECTED, ANTI_SAT_MISSILE_ROUNDS, ATC_SCRAMBLE_SELECTED, BIO_WEAPON_SELECTED, BOMBARDMENT_SELECTED, COMM_INTERRUP_SELECTED, DRONE_SWARM_HIT_NOTIFICATION, DRONE_SWARM_NOTIFY_CLEAR, DRONE_SWARM_SELECTED, EVENT_BATTLE, EVENT_REFUEL, GOLDEN_EYE_SELECTED, INITIAL_GAMESTATE, INSURGENCY_SELECTED, MISSILE_DISRUPT_SELECTED, MISSILE_SELECTED, NEW_ROUND, NO_MORE_EVENTS, NUKE_SELECTED, PLACE_PHASE, RAISE_MORALE_SELECTED, REMOTE_SENSING_HIT_ACTION, REMOTE_SENSING_SELECTED, RODS_FROM_GOD_SELECTED, SEA_MINE_HIT_NOTIFICATION, SEA_MINE_NOTIFY_CLEAR, SEA_MINE_SELECTED, SLICE_CHANGE } from '../../../../constants';
// prettier-ignore
import { AntiSatAction, AntiSatHitAction, AtcScrambleAction, BioWeaponsAction, BombardmentAction, CapabilitiesState, ClearDroneSwarmMineNotifyAction, ClearSeaMineNotifyAction, CommInterruptAction, DroneSwarmAction, DroneSwarmHitNotifyAction, EventBattleAction, EventRefuelAction, GameInitialStateAction, GoldenEyeAction, InsurgencyAction, MissileAction, MissileDisruptAction, NewRoundAction, NoMoreEventsAction, NukeAction, PlacePhaseAction, RaiseMoraleAction, RemoteSensingAction, RemoteSensingHitAction, RodsFromGodAction, SeaMineAction, SeaMineHitNotifyAction, SliceChangeAction } from '../../../../types';

type CapabilityReducerActions =
    | GameInitialStateAction
    | NewRoundAction
    | PlacePhaseAction
    | AntiSatAction
    | RaiseMoraleAction
    | RodsFromGodAction
    | CommInterruptAction
    | InsurgencyAction
    | MissileAction
    | BombardmentAction
    | MissileDisruptAction
    | RemoteSensingAction
    | GoldenEyeAction
    | SliceChangeAction
    | RemoteSensingHitAction
    | AntiSatHitAction
    | EventBattleAction
    | SeaMineAction
    | AtcScrambleAction
    | NukeAction
    | DroneSwarmAction
    | ClearSeaMineNotifyAction
    | SeaMineHitNotifyAction
    | DroneSwarmHitNotifyAction
    | ClearDroneSwarmMineNotifyAction
    | NoMoreEventsAction
    | EventRefuelAction
    | BioWeaponsAction;

const initialCapabilitiesState: CapabilitiesState = {
    confirmedRods: [],
    confirmedRemoteSense: [],
    confirmedInsurgency: [],
    confirmedBioWeapons: [],
    confirmedRaiseMorale: [],
    confirmedCommInterrupt: [],
    confirmedGoldenEye: [],
    confirmedSeaMines: [],
    seaMineHits: [],
    confirmedDroneSwarms: [],
    droneSwarmHits: [],
    confirmedAtcScramble: [],
    confirmedNukes: [],
    confirmedMissileAttacks: [],
    confirmedMissileHitPos: [],
    confirmedBombardments: [],
    confirmedBombardmentHitPos: [],
    confirmedAntiSat: [],
    confirmedAntiSatHitPos: [],
    confirmedMissileDisrupts: []
};

export function capabilitiesReducer(state = initialCapabilitiesState, action: CapabilityReducerActions) {
    const { type } = action;

    let stateCopy: CapabilitiesState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            Object.assign(stateCopy, (action as GameInitialStateAction).payload.capabilities);
            return stateCopy;

        case NEW_ROUND:
            stateCopy.confirmedRods = [];
            stateCopy.confirmedInsurgency = [];
            stateCopy.confirmedMissileHitPos = [];
            stateCopy.confirmedBombardmentHitPos = [];
            stateCopy.confirmedRemoteSense = (action as NewRoundAction).payload.confirmedRemoteSense;
            stateCopy.confirmedGoldenEye = (action as NewRoundAction).payload.confirmedGoldenEye;
            stateCopy.confirmedBioWeapons = (action as NewRoundAction).payload.confirmedBioWeapons;
            stateCopy.confirmedCommInterrupt = (action as NewRoundAction).payload.confirmedCommInterrupt;
            stateCopy.confirmedDroneSwarms = (action as NewRoundAction).payload.confirmedDroneSwarms;
            stateCopy.confirmedAtcScramble = (action as NewRoundAction).payload.confirmedAtcScramble;
            stateCopy.confirmedNukes = (action as NewRoundAction).payload.confirmedNukes;
            stateCopy.confirmedAntiSat = (action as NewRoundAction).payload.confirmedAntiSat;
            stateCopy.confirmedMissileDisrupts = (action as NewRoundAction).payload.confirmedMissileDisrupts;
            return stateCopy;

        case PLACE_PHASE:
            stateCopy.confirmedRemoteSense = (action as PlacePhaseAction).payload.confirmedRemoteSense;
            stateCopy.confirmedGoldenEye = (action as PlacePhaseAction).payload.confirmedGoldenEye;
            stateCopy.confirmedBioWeapons = (action as PlacePhaseAction).payload.confirmedBioWeapons;
            stateCopy.confirmedCommInterrupt = (action as PlacePhaseAction).payload.confirmedCommInterrupt;
            stateCopy.confirmedDroneSwarms = (action as PlacePhaseAction).payload.confirmedDroneSwarms;
            stateCopy.confirmedAtcScramble = (action as PlacePhaseAction).payload.confirmedAtcScramble;
            stateCopy.confirmedNukes = (action as PlacePhaseAction).payload.confirmedNukes;
            stateCopy.confirmedAntiSat = (action as PlacePhaseAction).payload.confirmedAntiSat;
            stateCopy.confirmedMissileDisrupts = (action as PlacePhaseAction).payload.confirmedMissileDisrupts;
            stateCopy.confirmedRods = [];
            stateCopy.confirmedInsurgency = [];
            stateCopy.confirmedMissileHitPos = [];
            stateCopy.confirmedBombardmentHitPos = [];
            return stateCopy;

        case RAISE_MORALE_SELECTED:
            stateCopy.confirmedRaiseMorale = (action as RaiseMoraleAction).payload.confirmedRaiseMorale;
            return stateCopy;

        case RODS_FROM_GOD_SELECTED:
            stateCopy.confirmedRods.push((action as RodsFromGodAction).payload.selectedPositionId);
            return stateCopy;

        case MISSILE_DISRUPT_SELECTED:
            stateCopy.confirmedMissileDisrupts.push((action as MissileDisruptAction).payload.selectedPiece.pieceId);
            return stateCopy;

        case ANTISAT_SELECTED:
            stateCopy.confirmedAntiSat.push(ANTI_SAT_MISSILE_ROUNDS);
            return stateCopy;

        case ANTISAT_HIT_ACTION:
            // remove the smallest antisat round in the array
            const minValue = Math.min(...stateCopy.confirmedAntiSat);
            stateCopy.confirmedAntiSat = stateCopy.confirmedAntiSat.filter(e => e !== minValue);
            stateCopy.confirmedAntiSatHitPos.push((action as AntiSatHitAction).payload.positionOfRemoteHit);
            return stateCopy;

        case REMOTE_SENSING_HIT_ACTION:
            stateCopy.confirmedAntiSatHitPos.push((action as RemoteSensingHitAction).payload.positionOfRemoteHit);
            stateCopy.confirmedRemoteSense = stateCopy.confirmedRemoteSense.filter(pos => {
                return pos !== (action as RemoteSensingHitAction).payload.positionOfRemoteHit;
            });
            return stateCopy;

        case MISSILE_SELECTED:
            // TODO: make sure this logic works correctly (it's okay if start undefined? (check that it's not already there...))
            stateCopy.confirmedMissileAttacks.push({
                missileId: (action as MissileAction).payload.selectedPiece.pieceId,
                targetId: (action as MissileAction).payload.selectedTargetPiece.pieceId
            });
            return stateCopy;

        case BOMBARDMENT_SELECTED:
            stateCopy.confirmedBombardments.push({
                destroyerId: (action as BombardmentAction).payload.selectedPiece.pieceId,
                targetId: (action as BombardmentAction).payload.selectedTargetPiece.pieceId
            });
            return stateCopy;

        case NUKE_SELECTED:
            stateCopy.confirmedNukes.push((action as NukeAction).payload.selectedPositionId);
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

        case SEA_MINE_SELECTED:
            stateCopy.confirmedSeaMines.push((action as SeaMineAction).payload.selectedPositionId);
            return stateCopy;

        case DRONE_SWARM_SELECTED:
            stateCopy.confirmedDroneSwarms.push((action as DroneSwarmAction).payload.selectedPositionId);
            return stateCopy;

        case ATC_SCRAMBLE_SELECTED:
            stateCopy.confirmedAtcScramble.push((action as AtcScrambleAction).payload.selectedPositionId);
            return stateCopy;

        case SEA_MINE_HIT_NOTIFICATION:
            stateCopy.seaMineHits = (action as SeaMineHitNotifyAction).payload.positionsToHighlight;
            stateCopy.confirmedSeaMines = stateCopy.confirmedSeaMines.filter(position => {
                return !(action as SeaMineHitNotifyAction).payload.positionsToHighlight.includes(position);
            });
            return stateCopy;

        case DRONE_SWARM_HIT_NOTIFICATION:
            stateCopy.droneSwarmHits = (action as DroneSwarmHitNotifyAction).payload.positionsToHighlight;
            stateCopy.confirmedDroneSwarms = stateCopy.confirmedDroneSwarms.filter(position => {
                return !(action as DroneSwarmHitNotifyAction).payload.positionsToHighlight.includes(position);
            });
            return stateCopy;

        case SEA_MINE_NOTIFY_CLEAR:
            stateCopy.seaMineHits = [];
            return stateCopy;

        case DRONE_SWARM_NOTIFY_CLEAR:
            stateCopy.droneSwarmHits = [];
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
            stateCopy.confirmedAtcScramble = (action as SliceChangeAction).payload.confirmedAtcScramble;
            stateCopy.confirmedNukes = (action as SliceChangeAction).payload.confirmedNukes;
            stateCopy.confirmedMissileHitPos = (action as SliceChangeAction).payload.confirmedMissileHitPos;
            stateCopy.confirmedBombardmentHitPos = (action as SliceChangeAction).payload.confirmedBombardmentHitPos;
            stateCopy.confirmedMissileDisrupts = (action as SliceChangeAction).payload.confirmedMissileDisrupts;
            stateCopy.confirmedAntiSatHitPos = [];
            stateCopy.confirmedMissileAttacks = [];
            return stateCopy;

        case EVENT_BATTLE:
        case NO_MORE_EVENTS:
        case EVENT_REFUEL:
            stateCopy.confirmedRods = [];
            stateCopy.confirmedInsurgency = [];
            stateCopy.confirmedBombardmentHitPos = [];
            stateCopy.confirmedMissileHitPos = [];
            stateCopy.confirmedAntiSatHitPos = [];
            return stateCopy;

        default:
            return state;
    }
}
