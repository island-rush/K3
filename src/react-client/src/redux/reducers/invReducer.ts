import { AnyAction } from 'redux';
//prettier-ignore
import { BIO_WEAPON_SELECTED, COMM_INTERRUP_SELECTED, GOLDEN_EYE_SELECTED, INITIAL_GAMESTATE, INSURGENCY_SELECTED, PIECE_PLACE, RAISE_MORALE_SELECTED, REMOTE_SENSING_SELECTED, RODS_FROM_GOD_SELECTED, SHOP_TRANSFER } from "../../../../constants";
// prettier-ignore
import { GameInitialStateAction, InvItemCapabilityAction, InvItemPlaceAction, InvItemType, InvState, ShopConfirmPurchaseAction } from '../../../../types';

const initialInvState: InvState = [];

type InvItemsPayloadAction = GameInitialStateAction | ShopConfirmPurchaseAction;

export function invReducer(state = initialInvState, action: AnyAction) {
    const { type } = action;

    let stateCopy: InvState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
        case SHOP_TRANSFER:
            return (action as InvItemsPayloadAction).payload.invItems;

        case PIECE_PLACE:
            return stateCopy.filter((invItem: InvItemType) => {
                return invItem.invItemId !== (action as InvItemPlaceAction).payload.invItemId;
            });

        case RODS_FROM_GOD_SELECTED:
        case REMOTE_SENSING_SELECTED:
        case INSURGENCY_SELECTED:
        case BIO_WEAPON_SELECTED:
        case RAISE_MORALE_SELECTED:
        case GOLDEN_EYE_SELECTED:
        case COMM_INTERRUP_SELECTED:
            return stateCopy.filter((invItem: InvItemType) => {
                return invItem.invItemId !== (action as InvItemCapabilityAction).payload.invItem.invItemId;
            });

        default:
            return state;
    }
}
