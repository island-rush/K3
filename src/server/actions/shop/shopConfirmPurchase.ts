import { Socket } from 'socket.io';
// prettier-ignore
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, PURCHASE_PHASE_ID, SHOP_TRANSFER, TYPE_MAIN } from '../../../constants';
import { GameSession, ShopConfirmPurchaseAction } from '../../../types';
import { Game, InvItem, ShopItem } from '../../classes';
import { redirectClient, sendToThisTeam, sendUserFeedback } from '../../helpers';

/** *
 * Transfers ShopItems into InvItems ("confirms" them, no longer able to refund once inside inventory...)
 */
export const shopConfirmPurchase = async (socket: Socket) => {
    // Grab the Session
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3 as GameSession;

    // Grab the Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        redirectClient(socket, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase } = thisGame;

    if (!gameActive) {
        redirectClient(socket, GAME_INACTIVE_TAG);
        return;
    }

    if (gamePhase !== PURCHASE_PHASE_ID) {
        sendUserFeedback(socket, 'Not the right phase...');
        return;
    }

    // Only the main controller (0) can confirm purchase
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, 'Not the main controller (0)...');
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
    sendToThisTeam(socket, serverAction);
};
