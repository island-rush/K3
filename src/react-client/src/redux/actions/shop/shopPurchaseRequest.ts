import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { SERVER_SHOP_PURCHASE_REQUEST, ShopPurchaseRequestAction } from '../../../../../types';

/**
 * Action to purchase a shop item.
 */
export const shopPurchaseRequest = (shopItemTypeId: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const clientAction: ShopPurchaseRequestAction = {
            type: SERVER_SHOP_PURCHASE_REQUEST,
            payload: {
                shopItemTypeId
            }
        };

        sendToServer(clientAction);
    };
};
