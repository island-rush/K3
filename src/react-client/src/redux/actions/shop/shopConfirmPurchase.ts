import { Dispatch } from 'redux';
import { EmitType, ShopConfirmPurchaseRequestAction } from '../../../interfaces/interfaces';
import { SOCKET_CLIENT_SENDING_ACTION } from '../../../constants/otherConstants';
import { SERVER_SHOP_CONFIRM_PURCHASE } from '../actionTypes';

//TODO: more checks on if they can purchase before sending to backend (don't waste network)
/**
 * Action to confirm all purchases in the cart.
 */
const shopConfirmPurchase = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const clientAction: ShopConfirmPurchaseRequestAction = {
            type: SERVER_SHOP_CONFIRM_PURCHASE
        };
        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default shopConfirmPurchase;
