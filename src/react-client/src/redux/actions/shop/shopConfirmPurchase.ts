import { Dispatch } from 'redux';
import { SERVER_SHOP_CONFIRM_PURCHASE, SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { EmitType, FullState, ShopConfirmPurchaseRequestAction } from '../../../../../types';

//TODO: more checks on if they can purchase before sending to backend (don't waste network)
/**
 * Action to confirm all purchases in the cart.
 */
export const shopConfirmPurchase = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const clientAction: ShopConfirmPurchaseRequestAction = {
            type: SERVER_SHOP_CONFIRM_PURCHASE
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};
