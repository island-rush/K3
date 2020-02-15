import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { PURCHASE_PHASE_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { SERVER_SHOP_CONFIRM_PURCHASE, ShopConfirmPurchaseRequestAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

// TODO: more checks on if they can purchase before sending to backend (don't waste network)
/**
 * Action to confirm all purchases in the cart.
 */
export const shopConfirmPurchase = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { shopItems, gameInfo } = getState();

        const { gamePhase, gameControllers, gameStatus } = gameInfo;

        if (gamePhase !== PURCHASE_PHASE_ID) {
            dispatch(setUserfeedbackAction('must be in purchase phase to confirm purchase.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('you already confirmed done with phase.'));
            return;
        }

        if (!gameControllers.includes(TYPE_MAIN)) {
            dispatch(setUserfeedbackAction('must be main controller to confirm purchase.'));
            return;
        }

        if (shopItems.length === 0) {
            dispatch(setUserfeedbackAction('Shop is empty, buy before confirming.'));
            return;
        }

        const clientAction: ShopConfirmPurchaseRequestAction = {
            type: SERVER_SHOP_CONFIRM_PURCHASE
        };

        sendToServer(clientAction);
    };
};
