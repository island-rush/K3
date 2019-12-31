import { AnyAction } from 'redux';
//prettier-ignore
import { AIRCRAFT_CLICK, BATTLE_FIGHT_RESULTS, BATTLE_PIECE_SELECT, BIO_WEAPON_SELECTED, BIO_WEAPON_SELECTING, CANCEL_PLAN, COMBAT_PHASE, COMM_INTERRUPT_SELECTING, COMM_INTERRUP_SELECTED, DELETE_PLAN, ENEMY_PIECE_SELECT, EVENT_BATTLE, EVENT_REFUEL, GOLDEN_EYE_SELECTED, GOLDEN_EYE_SELECTING, INITIAL_GAMESTATE, INNER_PIECE_CLICK_ACTION, INNER_TRANSPORT_PIECE_CLICK_ACTION, INSURGENCY_SELECTED, INSURGENCY_SELECTING, MAIN_BUTTON_CLICK, NEWS_PHASE, NEW_ROUND, NO_MORE_EVENTS, OUTER_PIECE_CLICK_ACTION, PIECE_CLOSE_ACTION, PIECE_OPEN_ACTION, PLACE_PHASE, PLAN_WAS_CONFIRMED, PURCHASE_PHASE, RAISE_MORALE_SELECTED, RAISE_MORALE_SELECTING, REMOTE_SENSING_SELECTED, REMOTE_SENSING_SELECTING, RODS_FROM_GOD_SELECTED, RODS_FROM_GOD_SELECTING, SET_USERFEEDBACK, SHOP_PURCHASE, SHOP_REFUND, SHOP_TRANSFER, SLICE_CHANGE, START_PLAN, TARGET_PIECE_SELECT, UPDATE_FLAGS } from "../../../../constants";
import { UserfeedbackAction, UserfeedbackState } from '../../../../types';

const initialUserFeedback: UserfeedbackState = 'Loading...';

export function userFeedbackReducer(state = initialUserFeedback, action: AnyAction) {
    const { type } = action;

    switch (type) {
        case INITIAL_GAMESTATE:
            return 'Welcome to Island Rush!';

        case SET_USERFEEDBACK:
            return (action as UserfeedbackAction).payload.userFeedback;

        case SHOP_REFUND:
            return 'Refunded the purchase!';

        case INNER_TRANSPORT_PIECE_CLICK_ACTION:
            return 'Clicked a piece that was in a transport piece';

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
            return 'selected position to kill!';

        case BIO_WEAPON_SELECTED:
            return 'selected position to deploy bio weapons to';

        case BIO_WEAPON_SELECTING:
            return 'Now select a position to get bio weaponed!';

        case REMOTE_SENSING_SELECTED:
            return 'selected area to remote sense!';

        case RAISE_MORALE_SELECTING:
            return 'Now select a commander type to boost with +1 moves.';

        case RAISE_MORALE_SELECTED:
            return 'selected a commander type to boost.';

        case REMOTE_SENSING_SELECTING:
            return 'Now select an area to remote sense.';

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

        case AIRCRAFT_CLICK:
            return 'transferring fuel planned...';

        case PLAN_WAS_CONFIRMED:
            return 'Plan was confirmed!';

        case MAIN_BUTTON_CLICK:
            return 'Waiting on the other team...';

        case PURCHASE_PHASE:
            return 'Switched to the purchase phase....check out the shop and buy stuff...';

        case UPDATE_FLAGS:
            return 'island was captured btw';

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

        case BATTLE_PIECE_SELECT:
            return 'Selected Piece to attack with...';

        case TARGET_PIECE_SELECT:
            return 'Target piece clicked?';

        case ENEMY_PIECE_SELECT:
            return 'Enemy piece clicked?';

        case NO_MORE_EVENTS:
            return 'ready to execute next step!';

        case BATTLE_FIGHT_RESULTS:
            return 'got results of the battle...';

        case EVENT_BATTLE:
            return 'battle has started!';

        case EVENT_REFUEL:
            return 'got a refuel event for ya, please handle it...';

        case OUTER_PIECE_CLICK_ACTION:
            return 'clicked outer piece';

        case PIECE_OPEN_ACTION:
            return 'openned the piece container thing.';

        case PIECE_CLOSE_ACTION:
            return 'closed the piece container thing.';

        case INNER_PIECE_CLICK_ACTION:
            return 'clicked inner piece';

        default:
            return state;
    }
}

export default userFeedbackReducer;
