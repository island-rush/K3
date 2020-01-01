import { Dispatch } from 'redux';
import { SERVER_SHOP_REFUND_REQUEST, SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { EmitType, ShopItemType, ShopRefundRequestAction } from '../../../../../types';
import { FullState } from '../../reducers';

/**
 * Action to refund an item from the shop.
 */
export const shopRefundRequest = (shopItem: ShopItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const clientAction: ShopRefundRequestAction = {
            type: SERVER_SHOP_REFUND_REQUEST,
            payload: {
                shopItem
            }
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};
