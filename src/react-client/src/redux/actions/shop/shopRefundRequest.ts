import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { PURCHASE_PHASE_ID, TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { SERVER_SHOP_REFUND_REQUEST, ShopItemType, ShopRefundRequestAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to refund an item from the shop.
 */
export const shopRefundRequest = (shopItem: ShopItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

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

        const clientAction: ShopRefundRequestAction = {
            type: SERVER_SHOP_REFUND_REQUEST,
            payload: {
                shopItem
            }
        };

        sendToServer(clientAction);
    };
};
