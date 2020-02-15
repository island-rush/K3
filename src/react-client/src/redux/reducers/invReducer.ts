import { AnyAction } from 'redux';
// prettier-ignore
import { AntiSatAction, ANTISAT_SELECTED, AtcScrambleAction, ATC_SCRAMBLE_SELECTED, BioWeaponsAction, BIO_WEAPON_SELECTED, CommInterruptAction, COMM_INTERRUP_SELECTED, CyberDefenseAction, CyberDefenseCheckAction, CYBER_DEFENSE_CHECK, CYBER_DEFENSE_SELECTED, DroneSwarmAction, DRONE_SWARM_SELECTED, GameInitialStateAction, GoldenEyeAction, GOLDEN_EYE_SELECTED, INITIAL_GAMESTATE, InsurgencyAction, INSURGENCY_SELECTED, InvItemPlaceAction, InvItemType, InvState, MissileDisruptAction, MISSILE_DISRUPT_SELECTED, NukeAction, NUKE_SELECTED, PIECE_PLACE, RaiseMoraleAction, RAISE_MORALE_SELECTED, RemoteSensingAction, REMOTE_SENSING_SELECTED, RodsFromGodAction, RODS_FROM_GOD_SELECTED, SeaMineAction, SEA_MINE_SELECTED, ShopConfirmPurchaseAction, SHOP_TRANSFER } from '../../../../types';

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
