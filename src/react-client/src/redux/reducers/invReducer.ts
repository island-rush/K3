//prettier-ignore
import { AnyAction } from "redux";
import { InvItemPlaceAction, ShopConfirmPurchaseAction } from '../../constants/interfaces';
import { InvState } from "../../interfaces/reducerTypes";
//prettier-ignore
import { BIO_WEAPON_SELECTED, COMM_INTERRUP_SELECTED, GOLDEN_EYE_SELECTED, INITIAL_GAMESTATE, INSURGENCY_SELECTED, PIECE_PLACE, RAISE_MORALE_SELECTED, REMOTE_SENSING_SELECTED, RODS_FROM_GOD_SELECTED, SHOP_TRANSFER } from "../actions/actionTypes";
import { InvItemType } from "../../interfaces/classTypes";

const initialInvState: InvState = [];

function invReducer(state = initialInvState, action: AnyAction) {
    const { type } = action;
    switch (type) {
        case INITIAL_GAMESTATE:
            return (action as AnyAction).payload.invItems;
        case SHOP_TRANSFER:
            return (action as ShopConfirmPurchaseAction).payload.invItems;
        case PIECE_PLACE:
            return state.filter((invItem: InvItemType) => {
                return invItem.invItemId !== (action as InvItemPlaceAction).payload.invItemId;
            });
        //These methods are all removing the capability from the inventory
        case RODS_FROM_GOD_SELECTED:
        case REMOTE_SENSING_SELECTED:
        case INSURGENCY_SELECTED:
        case BIO_WEAPON_SELECTED:
        case RAISE_MORALE_SELECTED:
        case GOLDEN_EYE_SELECTED:
        case COMM_INTERRUP_SELECTED:
            return state.filter((invItem: InvItemType) => {
                // TODO: change 'AnyAction' to some subset of all of these actions (they all have payloads with invItem)
                return invItem.invItemId !== (action as AnyAction).payload.invItem.invItemId;
            });
        default:
            return state;
    }
}

export default invReducer;
