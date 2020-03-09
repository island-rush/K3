import { AnyAction } from 'redux';
//prettier-ignore
import { ANTISAT_HIT_ACTION, ANTISAT_SELECTED, ATC_SCRAMBLE_SELECTED, ATC_SCRAMBLE_SELECTING, BATTLE_FIGHT_RESULTS, BIO_WEAPON_SELECTED, BIO_WEAPON_SELECTING, BOMBARDMENT_SELECTED, BOMBARDMENT_SELECTING, CANCEL_PLAN, COMBAT_PHASE, COMM_INTERRUPT_SELECTING, COMM_INTERRUP_SELECTED, CyberDefenseCheckAction, CYBER_DEFENSE_CHECK, CYBER_DEFENSE_SELECTED, DELETE_PLAN, DRONE_SWARM_SELECTED, DRONE_SWARM_SELECTING, EVENT_BATTLE, GOLDEN_EYE_SELECTED, GOLDEN_EYE_SELECTING, INITIAL_GAMESTATE, INSURGENCY_SELECTED, INSURGENCY_SELECTING, MAIN_BUTTON_CLICK, MISSILE_DISRUPT_SELECTED, MISSILE_DISRUPT_SELECTING, MISSILE_SELECTED, MISSILE_SELECTING, NEWS_PHASE, NEW_ROUND, NO_MORE_BATTLES, NUKE_SELECTED, NUKE_SELECTING, PLACE_PHASE, PLAN_WAS_CONFIRMED, PURCHASE_PHASE, RAISE_MORALE_SELECTED, RAISE_MORALE_SELECTING, REMOTE_SENSING_HIT_ACTION, REMOTE_SENSING_SELECTED, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTED, RODS_FROM_GOD_SELECTING, SEA_MINE_SELECTED, SEA_MINE_SELECTING, SET_USERFEEDBACK, SHOP_PURCHASE, SHOP_REFUND, SHOP_TRANSFER, SLICE_CHANGE, START_PLAN, UserfeedbackAction, UserfeedbackState } from '../../../../types';
import {
    CYBER_DOMINANCE_TYPE_ID,
    TYPE_NAMES,
    BIOLOGICAL_WEAPONS_TYPE_ID,
    MISSILE_TYPE_ID,
    TRANSPORT_TYPE_ID,
    SEA_MINES_TYPE_ID,
    DESTROYER_TYPE_ID,
    ANTI_SATELLITE_MISSILES_TYPE_ID,
    C_130_TYPE_ID,
    DRONE_SWARMS_TYPE_ID,
    NUCLEAR_STRIKE_TYPE_ID,
    REMOTE_SENSING_TYPE_ID
} from '../../../../constants';

const initialUserFeedback: UserfeedbackState = 'Loading...';

export function userFeedbackReducer(state = initialUserFeedback, action: AnyAction) {
    const { type } = action;

    switch (type) {
        case INITIAL_GAMESTATE:
            return 'Welcome to Island Rush!';

        case SET_USERFEEDBACK:
            return (action as UserfeedbackAction).payload.userFeedback;

        case CYBER_DEFENSE_CHECK:
            if ((action as CyberDefenseCheckAction).payload.isActive) {
                return `Other team has ${TYPE_NAMES[CYBER_DOMINANCE_TYPE_ID]} active!`;
            } else {
                return `Other team does not have ${TYPE_NAMES[CYBER_DOMINANCE_TYPE_ID]} yet.`;
            }

        case SHOP_REFUND:
            return 'Refunded the purchase!';

        case SHOP_PURCHASE:
            return 'Purchased the item!';

        case SHOP_TRANSFER:
            return 'Confirmed the purchases...check the inventory!';

        case START_PLAN:
            return 'Now Planning: Select positions to create the plan...';

        case CANCEL_PLAN:
            return 'Cancelled the plan...';

        case DELETE_PLAN:
            return 'Deleted the confirmed plan...';

        case RODS_FROM_GOD_SELECTING:
            return 'Now select a position to be obliterated.';

        case RODS_FROM_GOD_SELECTED:
            return 'Selected position to kill!';

        case CYBER_DEFENSE_SELECTED:
            return `${TYPE_NAMES[CYBER_DOMINANCE_TYPE_ID]} is now active.`;

        case BIO_WEAPON_SELECTED:
            return `Selected position to deploy ${TYPE_NAMES[BIOLOGICAL_WEAPONS_TYPE_ID]} to.`;

        case BIO_WEAPON_SELECTING:
            return `Now select a position to deploy ${TYPE_NAMES[BIOLOGICAL_WEAPONS_TYPE_ID]}!`;

        case MISSILE_SELECTED:
            return `Selected piece to try and hit with ${TYPE_NAMES[MISSILE_TYPE_ID]}.`;

        case MISSILE_SELECTING:
            return `Now select a piece to target with the ${TYPE_NAMES[MISSILE_TYPE_ID]}.`;

        case MISSILE_DISRUPT_SELECTED:
            return `Selected a ${TYPE_NAMES[MISSILE_TYPE_ID]} to Disrupt`;

        case MISSILE_DISRUPT_SELECTING:
            return `Now select a ${TYPE_NAMES[MISSILE_TYPE_ID]} in a silo to Disrupt.`;

        case SEA_MINE_SELECTING:
            return `Now select a ${TYPE_NAMES[TRANSPORT_TYPE_ID]} to deploy ${TYPE_NAMES[SEA_MINES_TYPE_ID]}.`;

        case SEA_MINE_SELECTED:
            return `Selected a ${TYPE_NAMES[TRANSPORT_TYPE_ID]} to deploy ${TYPE_NAMES[SEA_MINES_TYPE_ID]}.`;

        case BOMBARDMENT_SELECTING:
            return 'Now select a land piece within range to Bombard.';

        case BOMBARDMENT_SELECTED:
            return `Selected a target to Bombard with ${TYPE_NAMES[DESTROYER_TYPE_ID]}`;

        case ANTISAT_SELECTED:
            return `${TYPE_NAMES[ANTI_SATELLITE_MISSILES_TYPE_ID]} are live and actively looking for satellites to kill.`;

        case ANTISAT_HIT_ACTION:
            return `${TYPE_NAMES[ANTI_SATELLITE_MISSILES_TYPE_ID]} hit a target! enemy is now blinded.`;

        case REMOTE_SENSING_HIT_ACTION:
            return `enemy has used ${TYPE_NAMES[ANTI_SATELLITE_MISSILES_TYPE_ID]} to destroy the satellite!`;

        case DRONE_SWARM_SELECTING:
            return `Now select a ${TYPE_NAMES[C_130_TYPE_ID]} to drop off some ${TYPE_NAMES[DRONE_SWARMS_TYPE_ID]}.`;

        case DRONE_SWARM_SELECTED:
            return `selected a ${TYPE_NAMES[C_130_TYPE_ID]} to deploy ${TYPE_NAMES[DRONE_SWARMS_TYPE_ID]}.`;

        case NUKE_SELECTING:
            return `Now select an area to use ${TYPE_NAMES[NUCLEAR_STRIKE_TYPE_ID]}`;

        case NUKE_SELECTED:
            return `selected an area to use ${TYPE_NAMES[NUCLEAR_STRIKE_TYPE_ID]}.`;

        case ATC_SCRAMBLE_SELECTING:
            return 'Now select an airfield to disable for a while.';

        case ATC_SCRAMBLE_SELECTED:
            return 'selected an airfield to disable for a while.';

        case REMOTE_SENSING_SELECTED:
            return `selected area to use ${TYPE_NAMES[REMOTE_SENSING_TYPE_ID]}!`;

        case RAISE_MORALE_SELECTING:
            return 'Now select a commander type to boost with +1 moves.';

        case RAISE_MORALE_SELECTED:
            return 'selected a commander type to boost.';

        case REMOTE_SENSING_SELECTING:
            return `Now select an area to use ${TYPE_NAMES[REMOTE_SENSING_TYPE_ID]}.`;

        case INSURGENCY_SELECTED:
            return 'selected position to start insurgency!';

        case INSURGENCY_SELECTING:
            return 'Now select a position to start an insurgency!';

        case COMM_INTERRUP_SELECTED:
            return 'selected an area to interrupt communication.';

        case COMM_INTERRUPT_SELECTING:
            return 'Now select an area to start interrupting communication!';

        case GOLDEN_EYE_SELECTED:
            return "selected an area to 'golden eye' thing";

        case GOLDEN_EYE_SELECTING:
            return "Now select an area to 'golden eye' thing";

        case PLAN_WAS_CONFIRMED:
            return 'Plan was confirmed!';

        case MAIN_BUTTON_CLICK:
            return 'Waiting on the other team...';

        case PURCHASE_PHASE:
            return 'Switched to the purchase phase....check out the shop and buy stuff...';

        case COMBAT_PHASE:
            return 'Switched to the combat phase...start to plan your turn by clicking on pieces!';

        case SLICE_CHANGE:
            return 'Done planning, click main button to execute the plan...';

        case NEWS_PHASE:
            return 'Switched to the news phase...';

        case NEW_ROUND:
            return 'New Round of Combat!...';

        case PLACE_PHASE:
            return 'Place troops onto the board from inventory...';

        case NO_MORE_BATTLES:
            return 'ready to execute next step!';

        case BATTLE_FIGHT_RESULTS:
            return 'got results of the battle...';

        case EVENT_BATTLE:
            return 'battle has started!';

        default:
            // Do nothing
            return state;
    }
}
