import { ShopItemType } from '../databaseTables';
import { GameInfoState, InvState } from '../reducerTypes';

export const SERVER_SHOP_PURCHASE_REQUEST = 'SERVER_SHOP_PURCHASE_REQUEST';
export type ShopPurchaseRequestAction = {
    type: typeof SERVER_SHOP_PURCHASE_REQUEST;
    payload: {
        shopItemTypeId: ShopItemType['shopItemTypeId'];
    };
};

export const SHOP_PURCHASE = 'SHOP_PURCHASE';
export type ShopPurchaseAction = {
    type: typeof SHOP_PURCHASE;
    payload: {
        shopItem: ShopItemType;
        points: GameInfoState['gamePoints'];
    };
};

export const SERVER_SHOP_REFUND_REQUEST = 'SERVER_SHOP_REFUND_REQUEST';
export type ShopRefundRequestAction = {
    type: typeof SERVER_SHOP_REFUND_REQUEST;
    payload: {
        shopItem: ShopItemType;
    };
};

export const SHOP_REFUND = 'SHOP_REFUND';
export type ShopRefundAction = {
    type: typeof SHOP_REFUND;
    payload: {
        shopItemId: ShopItemType['shopItemId'];
        pointsAdded: GameInfoState['gamePoints'];
    };
};

export const SERVER_SHOP_CONFIRM_PURCHASE = 'SERVER_SHOP_CONFIRM_PURCHASE';
export type ShopConfirmPurchaseRequestAction = {
    type: typeof SERVER_SHOP_CONFIRM_PURCHASE;
};

export const SHOP_TRANSFER = 'SHOP_TRANSFER';
export type ShopConfirmPurchaseAction = {
    type: typeof SHOP_TRANSFER;
    payload: {
        invItems: InvState;
    };
};
