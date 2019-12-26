import { AnyAction } from 'redux';
import { ShopItemType, ShopState } from '../../../../types';
import { GameInitialStateAction, ShopPurchaseAction, ShopRefundAction } from '../../interfaces/interfaces';
import { INITIAL_GAMESTATE, SHOP_CLEAR, SHOP_PURCHASE, SHOP_REFUND, SHOP_TRANSFER } from '../actions/actionTypes';

const initialShopState: ShopState = [];

function shopReducer(state = initialShopState, action: AnyAction) {
    const { type } = action;
    switch (type) {
        case INITIAL_GAMESTATE:
            state = (action as GameInitialStateAction).payload.shopItems;
            break;
        case SHOP_PURCHASE:
            state = state.concat([(action as ShopPurchaseAction).payload.shopItem]); //need to append the payload to the state
            break;
        case SHOP_CLEAR:
            state = [];
            break;
        case SHOP_REFUND:
            state = state.filter((shopItem: ShopItemType) => {
                return shopItem.shopItemId !== (action as ShopRefundAction).payload.shopItemId;
            });
            break;
        case SHOP_TRANSFER:
            state = [];
            break;
        default:
        //don't change anything...
    }

    return state;
}

export default shopReducer;
