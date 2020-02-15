import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { PURCHASE_PHASE_ID, TYPE_MAIN, WAITING_STATUS, TYPE_COSTS } from '../../../../../constants';
import { SERVER_SHOP_PURCHASE_REQUEST, ShopPurchaseRequestAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to purchase a shop item.
 */
export const shopPurchaseRequest = (shopItemTypeId: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

        const { gamePhase, gameControllers, gameStatus, gamePoints } = gameInfo;

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

        if (gamePoints < TYPE_COSTS[shopItemTypeId]) {
            dispatch(setUserfeedbackAction('not enough points to purchase.'));
            return;
        }

        const clientAction: ShopPurchaseRequestAction = {
            type: SERVER_SHOP_PURCHASE_REQUEST,
            payload: {
                shopItemTypeId
            }
        };

        sendToServer(clientAction);
    };
};
