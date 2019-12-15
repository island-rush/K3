//prettier-ignore
import { BIO_WEAPON_SELECTED, COMM_INTERRUP_SELECTED, GOLDEN_EYE_SELECTED, INITIAL_GAMESTATE, INSURGENCY_SELECTED, PIECE_PLACE, RAISE_MORALE_SELECTED, REMOTE_SENSING_SELECTED, RODS_FROM_GOD_SELECTED, SHOP_TRANSFER } from "../actions/actionTypes";

const initialInvState: any = [];

function invReducer(state = initialInvState, { type, payload }: { type: string; payload: any }) {
    switch (type) {
        case INITIAL_GAMESTATE:
            return payload.invItems;
        case SHOP_TRANSFER:
            return payload.invItems;
        case PIECE_PLACE:
            return state.filter((invItem: any) => {
                return invItem.invItemId !== payload.invItemId;
            });
        //These methods are all removing the capability from the inventory
        case RODS_FROM_GOD_SELECTED:
        case REMOTE_SENSING_SELECTED:
        case INSURGENCY_SELECTED:
        case BIO_WEAPON_SELECTED:
        case RAISE_MORALE_SELECTED:
        case GOLDEN_EYE_SELECTED:
        case COMM_INTERRUP_SELECTED:
            return state.filter((invItem: any) => {
                return invItem.invItemId !== payload.invItem.invItemId;
            });
        default:
            return state;
    }
}

export default invReducer;
