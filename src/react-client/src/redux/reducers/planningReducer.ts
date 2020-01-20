// prettier-ignore
import { BIO_WEAPON_SELECTED, BIO_WEAPON_SELECTING, CANCEL_PLAN, COMM_INTERRUPT_SELECTING, COMM_INTERRUP_SELECTED, DELETE_PLAN, DRONE_SWARM_SELECTED, DRONE_SWARM_SELECTING, GOLDEN_EYE_SELECTED, GOLDEN_EYE_SELECTING, INITIAL_GAMESTATE, INSURGENCY_SELECTED, INSURGENCY_SELECTING, PLANNING_SELECT, PLAN_WAS_CONFIRMED, RAISE_MORALE_SELECTED, RAISE_MORALE_SELECTING, REMOTE_SENSING_SELECTED, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTED, RODS_FROM_GOD_SELECTING, SEA_MINE_SELECTED, SEA_MINE_SELECTING, SLICE_CHANGE, START_PLAN, UNDO_MOVE } from '../../../../constants';
// prettier-ignore
import { BioWeaponsAction, BioWeaponSelectingAction, CommInterruptAction, CommInterruptSelectingAction, ConfirmPlanAction, DeletePlanAction, DroneSwarmAction, DroneSwarmSelectingAction, GameInitialStateAction, GoldenEyeAction, GoldenEyeSelectingAction, InsurgencyAction, InsurgencySelectingAction, PlanningSelectAction, PlanningState, PreventPlanAction, RaiseMoraleAction, RaiseMoraleSelectingAction, RemoteSenseSelectingAction, RemoteSensingAction, RodsFromGodAction, RodsFromGodSelectingAction, SeaMineAction, SeaMineSelectingAction, SliceChangeAction, StartPlanAction, UndoMoveAction } from '../../../../types';

type PlanningReducerActions =
    | GameInitialStateAction
    | StartPlanAction
    | RaiseMoraleSelectingAction
    | RaiseMoraleAction
    | InsurgencySelectingAction
    | BioWeaponSelectingAction
    | CommInterruptSelectingAction
    | RodsFromGodSelectingAction
    | GoldenEyeSelectingAction
    | RemoteSenseSelectingAction
    | SeaMineSelectingAction
    | SeaMineAction
    | DroneSwarmAction
    | DroneSwarmSelectingAction
    | RodsFromGodAction
    | BioWeaponsAction
    | CommInterruptAction
    | InsurgencyAction
    | RemoteSensingAction
    | GoldenEyeAction
    | PreventPlanAction
    | UndoMoveAction
    | PlanningSelectAction
    | ConfirmPlanAction
    | DeletePlanAction
    | SliceChangeAction;

type SelectingAction =
    | InsurgencySelectingAction
    | BioWeaponSelectingAction
    | SeaMineSelectingAction
    | DroneSwarmSelectingAction
    | CommInterruptSelectingAction
    | RodsFromGodSelectingAction
    | GoldenEyeSelectingAction
    | RemoteSenseSelectingAction;

const initialPlanningState: PlanningState = {
    active: false,
    capability: false,
    raiseMoralePopupActive: false,
    invItem: null,
    moves: [],
    confirmedPlans: {}
};

export function planningReducer(state = initialPlanningState, action: PlanningReducerActions) {
    const { type } = action;

    let stateCopy: PlanningState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            if ((action as GameInitialStateAction).payload.planning && (action as GameInitialStateAction).payload.planning.confirmedPlans) {
                stateCopy.confirmedPlans = (action as GameInitialStateAction).payload.planning.confirmedPlans;
            }
            return stateCopy;

        case START_PLAN:
            stateCopy.active = true;
            return stateCopy;

        case RAISE_MORALE_SELECTING:
            stateCopy.active = true;
            stateCopy.capability = true;
            stateCopy.invItem = (action as RaiseMoraleSelectingAction).payload.invItem;
            stateCopy.raiseMoralePopupActive = true;
            return stateCopy;

        case RAISE_MORALE_SELECTED:
            stateCopy.capability = false;
            stateCopy.invItem = null;
            stateCopy.active = false;
            stateCopy.raiseMoralePopupActive = false;
            return stateCopy;

        case INSURGENCY_SELECTING:
        case BIO_WEAPON_SELECTING:
        case COMM_INTERRUPT_SELECTING:
        case RODS_FROM_GOD_SELECTING:
        case SEA_MINE_SELECTING:
        case DRONE_SWARM_SELECTING:
        case GOLDEN_EYE_SELECTING:
        case REMOTE_SENSING_SELECTING:
            stateCopy.active = true;
            stateCopy.capability = true;
            stateCopy.invItem = (action as SelectingAction).payload.invItem;
            return stateCopy;

        case RODS_FROM_GOD_SELECTED:
        case BIO_WEAPON_SELECTED:
        case COMM_INTERRUP_SELECTED:
        case INSURGENCY_SELECTED:
        case SEA_MINE_SELECTED:
        case DRONE_SWARM_SELECTED:
        case REMOTE_SENSING_SELECTED:
        case GOLDEN_EYE_SELECTED:
            stateCopy.capability = false;
            stateCopy.invItem = null;
            stateCopy.active = false;
            return stateCopy;

        case CANCEL_PLAN:
            stateCopy.active = false;
            stateCopy.capability = false;
            stateCopy.moves = [];
            return stateCopy;

        case UNDO_MOVE:
            stateCopy.moves.pop();
            return stateCopy;

        case PLANNING_SELECT:
            //TODO: move this to userActions to have more checks there within the thunk
            stateCopy.moves.push({
                type: 'move',
                positionId: (action as PlanningSelectAction).payload.selectedPositionId
            });
            return stateCopy;

        case PLAN_WAS_CONFIRMED:
            const { pieceId, plan } = (action as ConfirmPlanAction).payload;
            stateCopy.confirmedPlans[pieceId] = plan;
            stateCopy.active = false;
            stateCopy.moves = [];
            return stateCopy;

        case DELETE_PLAN:
            delete stateCopy.confirmedPlans[(action as DeletePlanAction).payload.pieceId];
            return stateCopy;

        case SLICE_CHANGE:
            stateCopy.confirmedPlans = {};
            return stateCopy;

        default:
            return state;
    }
}
