// prettier-ignore
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, PURCHASE_PHASE_ID, SHOP_TRANSFER, TYPE_MAIN } from '../../../constants';
import { ShopConfirmPurchaseAction, SocketSession } from '../../../types';
import { Game, InvItem, ShopItem } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/** *
 * Transfers ShopItems into InvItems ("confirms" them, no longer able to refund once inside inventory...)
 */
export const shopConfirmPurchase = async (session: SocketSession) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    // Grab the Game
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        redirectClient(socketId, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase } = thisGame;

    if (!gameActive) {
        redirectClient(socketId, GAME_INACTIVE_TAG);
        return;
    }

    if (gamePhase !== PURCHASE_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // Only the main controller (0) can confirm purchase
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socketId, 'Not the main controller (0)...');
        return;
    }

    await InvItem.insertFromShop(gameId, gameTeam);

    await ShopItem.deleteAll(gameId, gameTeam);

    const invItems = await InvItem.all(gameId, gameTeam);

    const serverAction: ShopConfirmPurchaseAction = {
        type: SHOP_TRANSFER,
        payload: {
            invItems
        }
    };

    // Send update to client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
