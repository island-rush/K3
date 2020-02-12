import { AnyAction } from 'redux';
// prettier-ignore
import { ATC_SCRAMBLE_SELECTED, ATC_SCRAMBLE_SELECTING, BIO_WEAPON_SELECTED, BIO_WEAPON_SELECTING, BOMBARDMENT_SELECTED, BOMBARDMENT_SELECTING, CANCEL_PLAN, COMM_INTERRUPT_SELECTING, COMM_INTERRUP_SELECTED, DELETE_PLAN, DRONE_SWARM_SELECTED, DRONE_SWARM_SELECTING, GOLDEN_EYE_SELECTED, GOLDEN_EYE_SELECTING, INITIAL_GAMESTATE, INSURGENCY_SELECTED, INSURGENCY_SELECTING, MISSILE_DISRUPT_SELECTED, MISSILE_DISRUPT_SELECTING, MISSILE_SELECTED, MISSILE_SELECTING, NUKE_SELECTED, NUKE_SELECTING, PLANNING_SELECT, PLAN_WAS_CONFIRMED, RAISE_MORALE_SELECTED, RAISE_MORALE_SELECTING, REMOTE_SENSING_SELECTED, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTED, RODS_FROM_GOD_SELECTING, SEA_MINE_SELECTED, SEA_MINE_SELECTING, SLICE_CHANGE, START_PLAN, UNDO_MOVE } from '../../../../constants';
// prettier-ignore
import { AtcScrambleSelectingAction, BioWeaponSelectingAction, BombardmentSelectingAction, CommInterruptSelectingAction, ConfirmPlanAction, DeletePlanAction, DroneSwarmSelectingAction, GameInitialStateAction, GoldenEyeSelectingAction, InsurgencySelectingAction, MissileDisruptSelectingAction, MissileSelectingAction, NukeSelectingAction, PlanningSelectAction, PlanningState, RaiseMoraleSelectingAction, RemoteSenseSelectingAction, RodsFromGodSelectingAction, SeaMineSelectingAction } from '../../../../types';

const initialPlanningState: PlanningState = {
    isActive: false,
    isSelectingCommander: false,
    isUsingCapability: false,
    bombardmentSelecting: null,
    missileSelecting: null,
    invItem: null,
    moves: [],
    confirmedPlans: {}
};

export function planningReducer(state = initialPlanningState, action: AnyAction) {
    const { type } = action;

    let stateCopy: PlanningState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            if ((action as GameInitialStateAction).payload.planning && (action as GameInitialStateAction).payload.planning.confirmedPlans) {
                stateCopy.confirmedPlans = (action as GameInitialStateAction).payload.planning.confirmedPlans;
            }
            return stateCopy;

        case MISSILE_SELECTING:
            stateCopy.isActive = true;
            stateCopy.missileSelecting = (action as MissileSelectingAction).payload.selectedPiece;
            return stateCopy;

        case BOMBARDMENT_SELECTING:
            stateCopy.isActive = true;
            stateCopy.bombardmentSelecting = (action as BombardmentSelectingAction).payload.selectedPiece;
            return stateCopy;

        case START_PLAN:
            stateCopy.isActive = true;
            return stateCopy;

        case RAISE_MORALE_SELECTING:
            stateCopy.isActive = true;
            stateCopy.isUsingCapability = true;
            stateCopy.invItem = (action as RaiseMoraleSelectingAction).payload.invItem;
            stateCopy.isSelectingCommander = true;
            return stateCopy;

        case RAISE_MORALE_SELECTED:
            stateCopy.isUsingCapability = false;
            stateCopy.invItem = null;
            stateCopy.isActive = false;
            stateCopy.isSelectingCommander = false;
            return stateCopy;

        case INSURGENCY_SELECTING:
        case BIO_WEAPON_SELECTING:
        case COMM_INTERRUPT_SELECTING:
        case RODS_FROM_GOD_SELECTING:
        case SEA_MINE_SELECTING:
        case DRONE_SWARM_SELECTING:
        case NUKE_SELECTING:
        case MISSILE_DISRUPT_SELECTING:
        case ATC_SCRAMBLE_SELECTING:
        case GOLDEN_EYE_SELECTING:
        case REMOTE_SENSING_SELECTING:
            stateCopy.isActive = true;
            stateCopy.isUsingCapability = true;
            stateCopy.invItem = (action as SelectingActions).payload.invItem;
            return stateCopy;

        case RODS_FROM_GOD_SELECTED:
        case BIO_WEAPON_SELECTED:
        case COMM_INTERRUP_SELECTED:
        case MISSILE_SELECTED:
        case BOMBARDMENT_SELECTED:
        case INSURGENCY_SELECTED:
        case SEA_MINE_SELECTED:
        case DRONE_SWARM_SELECTED:
        case NUKE_SELECTED:
        case MISSILE_DISRUPT_SELECTED:
        case ATC_SCRAMBLE_SELECTED:
        case REMOTE_SENSING_SELECTED:
        case GOLDEN_EYE_SELECTED:
            stateCopy.isUsingCapability = false;
            stateCopy.invItem = null;
            stateCopy.isActive = false;
            stateCopy.missileSelecting = null;
            stateCopy.bombardmentSelecting = null;
            return stateCopy;

        case CANCEL_PLAN:
            stateCopy.isActive = false;
            stateCopy.isSelectingCommander = false;
            stateCopy.isUsingCapability = false;
            stateCopy.bombardmentSelecting = null;
            stateCopy.missileSelecting = null;
            stateCopy.invItem = null;
            stateCopy.moves = [];
            return stateCopy;

        case UNDO_MOVE:
            stateCopy.moves.pop();
            return stateCopy;

        case PLANNING_SELECT:
            stateCopy.moves.push((action as PlanningSelectAction).payload.selectedPositionId);
            return stateCopy;

        case PLAN_WAS_CONFIRMED:
            const { pieceId, plan } = (action as ConfirmPlanAction).payload;
            stateCopy.confirmedPlans[pieceId] = plan;
            stateCopy.isActive = false;
            stateCopy.moves = [];
            return stateCopy;

        case DELETE_PLAN:
            delete stateCopy.confirmedPlans[(action as DeletePlanAction).payload.pieceId];
            return stateCopy;

        case SLICE_CHANGE:
            stateCopy.isActive = false;
            stateCopy.isSelectingCommander = false;
            stateCopy.isUsingCapability = false;
            stateCopy.bombardmentSelecting = null;
            stateCopy.missileSelecting = null;
            stateCopy.invItem = null;
            stateCopy.moves = [];
            stateCopy.confirmedPlans = {};
            return stateCopy;

        default:
            // Do nothing
            return state;
    }
}

type SelectingActions =
    | InsurgencySelectingAction
    | BioWeaponSelectingAction
    | SeaMineSelectingAction
    | AtcScrambleSelectingAction
    | MissileDisruptSelectingAction
    | NukeSelectingAction
    | DroneSwarmSelectingAction
    | CommInterruptSelectingAction
    | RodsFromGodSelectingAction
    | GoldenEyeSelectingAction
    | RemoteSenseSelectingAction;
