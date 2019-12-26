import { Dispatch } from 'redux';
import { EmitType, ShopPurchaseRequestAction } from '../../../../../types';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { SERVER_SHOP_PURCHASE_REQUEST } from '../actionTypes';

/**
 * Action to purchase a shop item.
 */
export const shopPurchaseRequest = (shopItemTypeId: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
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
