import { Dispatch } from 'redux';
import { EmitType, ShopPurchaseRequestAction } from '../../../constants/interfaces';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../constants/otherConstants';
import { SERVER_SHOP_PURCHASE_REQUEST } from '../actionTypes';

/**
 * Action to purchase a shop item.
 */
const shopPurchaseRequest = (shopItemTypeId: number) => {
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
