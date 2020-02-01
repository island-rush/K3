import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { SERVER_SHOP_CONFIRM_PURCHASE } from '../../../../../constants';
import { ShopConfirmPurchaseRequestAction } from '../../../../../types';

// TODO: more checks on if they can purchase before sending to backend (don't waste network)
/**
 * Action to confirm all purchases in the cart.
 */
export const shopConfirmPurchase = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const clientAction: ShopConfirmPurchaseRequestAction = {
            type: SERVER_SHOP_CONFIRM_PURCHASE
        };

        sendToServer(clientAction);
    };
};
