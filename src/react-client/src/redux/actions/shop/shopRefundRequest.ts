import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { SERVER_SHOP_REFUND_REQUEST } from '../../../../../constants';
import { ShopItemType, ShopRefundRequestAction } from '../../../../../types';

/**
 * Action to refund an item from the shop.
 */
export const shopRefundRequest = (shopItem: ShopItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const clientAction: ShopRefundRequestAction = {
            type: SERVER_SHOP_REFUND_REQUEST,
            payload: {
                shopItem
            }
        };

        sendToServer(clientAction);
    };
};
