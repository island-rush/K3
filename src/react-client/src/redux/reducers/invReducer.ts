import { AnyAction } from 'redux';
// prettier-ignore
import { ANTISAT_SELECTED, ATC_SCRAMBLE_SELECTED, BIO_WEAPON_SELECTED, COMM_INTERRUP_SELECTED, CYBER_DEFENSE_CHECK, CYBER_DEFENSE_SELECTED, DRONE_SWARM_SELECTED, GOLDEN_EYE_SELECTED, INITIAL_GAMESTATE, INSURGENCY_SELECTED, MISSILE_DISRUPT_SELECTED, NUKE_SELECTED, PIECE_PLACE, RAISE_MORALE_SELECTED, REMOTE_SENSING_SELECTED, RODS_FROM_GOD_SELECTED, SEA_MINE_SELECTED, SHOP_TRANSFER } from "../../../../constants";
// prettier-ignore
import { AntiSatAction, AtcScrambleAction, BioWeaponsAction, CommInterruptAction, CyberDefenseAction, CyberDefenseCheckAction, DroneSwarmAction, GameInitialStateAction, GoldenEyeAction, InsurgencyAction, InvItemPlaceAction, InvItemType, InvState, MissileDisruptAction, NukeAction, RaiseMoraleAction, RemoteSensingAction, RodsFromGodAction, SeaMineAction, ShopConfirmPurchaseAction } from '../../../../types';

const initialInvState: InvState = [];

export function invReducer(state = initialInvState, action: AnyAction) {
    const { type } = action;

    let stateCopy: InvState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
        case SHOP_TRANSFER:
            return (action as InvItemsPayloadActions).payload.invItems;

        case PIECE_PLACE:
        case RODS_FROM_GOD_SELECTED:
        case REMOTE_SENSING_SELECTED:
        case INSURGENCY_SELECTED:
        case BIO_WEAPON_SELECTED:
        case RAISE_MORALE_SELECTED:
        case SEA_MINE_SELECTED:
        case DRONE_SWARM_SELECTED:
        case NUKE_SELECTED:
        case CYBER_DEFENSE_SELECTED:
        case MISSILE_DISRUPT_SELECTED:
        case CYBER_DEFENSE_CHECK:
        case ANTISAT_SELECTED:
        case GOLDEN_EYE_SELECTED:
        case ATC_SCRAMBLE_SELECTED:
        case COMM_INTERRUP_SELECTED:
            return stateCopy.filter((invItem: InvItemType) => {
                return invItem.invItemId !== (action as InvItemCombinedActions).payload.invItem.invItemId;
            });

        default:
            // Do nothing
            return state;
    }
}

type InvItemsPayloadActions = GameInitialStateAction | ShopConfirmPurchaseAction;

type InvItemCombinedActions =
    | RodsFromGodAction
    | RemoteSensingAction
    | InsurgencyAction
    | BioWeaponsAction
    | RaiseMoraleAction
    | CyberDefenseAction
    | CyberDefenseCheckAction
    | MissileDisruptAction
    | SeaMineAction
    | AntiSatAction
    | DroneSwarmAction
    | InvItemPlaceAction
    | NukeAction
    | AtcScrambleAction
    | GoldenEyeAction
    | CommInterruptAction;
