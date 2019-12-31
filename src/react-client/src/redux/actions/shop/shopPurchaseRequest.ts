import { Dispatch } from 'redux';
import { SERVER_SHOP_PURCHASE_REQUEST, SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { EmitType, FullState, ShopPurchaseRequestAction } from '../../../../../types';

/**
 * Action to purchase a shop item.
 */
export const shopPurchaseRequest = (shopItemTypeId: number) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const clientAction: ShopPurchaseRequestAction = {
            type: SERVER_SHOP_PURCHASE_REQUEST,
            payload: {
                shopItemTypeId
            }
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default shopPurchaseRequest;
