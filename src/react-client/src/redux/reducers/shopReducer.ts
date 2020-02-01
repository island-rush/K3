import { AnyAction } from 'redux';
import { INITIAL_GAMESTATE, SHOP_PURCHASE, SHOP_REFUND, SHOP_TRANSFER } from '../../../../constants';
import { GameInitialStateAction, ShopItemType, ShopPurchaseAction, ShopRefundAction, ShopState } from '../../../../types';

const initialShopState: ShopState = [];

export function shopReducer(state = initialShopState, action: AnyAction) {
    const { type } = action;

    let stateCopy: ShopState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            return (action as GameInitialStateAction).payload.shopItems;

        case SHOP_PURCHASE:
            return stateCopy.concat([(action as ShopPurchaseAction).payload.shopItem]);

        case SHOP_TRANSFER:
            return [];

        case SHOP_REFUND:
            return stateCopy.filter((shopItem: ShopItemType) => {
                return shopItem.shopItemId !== (action as ShopRefundAction).payload.shopItemId;
            });

        default:
            // Do nothing
            return state;
    }
}
