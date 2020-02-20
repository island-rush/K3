// prettier-ignore
import { BAD_REQUEST_TAG, BLUE_TEAM_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, PURCHASE_PHASE_ID, TYPE_COSTS, TYPE_MAIN } from '../../../constants';
import { ShopRefundAction, ShopRefundRequestAction, SHOP_REFUND, SocketSession } from '../../../types';
import { Game, ShopItem } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * Client is requesting to refund a certain ShopItem in their cart
 */
export const shopRefundRequest = async (session: SocketSession, action: ShopRefundRequestAction) => {
    // Grab Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    // Get Game
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        redirectClient(socketId, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameBluePoints, gameRedPoints } = thisGame;

    if (!gameActive) {
        redirectClient(socketId, GAME_INACTIVE_TAG);
        return;
    }

    if (gamePhase !== PURCHASE_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    // Only the main controller (0) can refund things
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socketId, 'Not the main controller (0)...');
        return;
    }

    // Does the item exist?
    const { shopItemId } = action.payload.shopItem;
    const thisShopItem = await new ShopItem(shopItemId).init();
    if (!thisShopItem) {
        sendUserFeedback(socketId, 'Shop Item did not exist...');
        return;
    }

    const { shopItemGameId, shopItemTeamId, shopItemTypeId } = thisShopItem; // get shopItem details from database, not user

    // Do they own the shop item?
    if (shopItemGameId !== gameId || shopItemTeamId !== gameTeam) {
        redirectClient(socketId, BAD_REQUEST_TAG);
        return;
    }

    const itemCost = TYPE_COSTS[shopItemTypeId];
    const teamPoints = gameTeam === BLUE_TEAM_ID ? gameBluePoints : gameRedPoints;

    // Refund the shopItem
    const newPoints = teamPoints + itemCost;
    await thisGame.setPoints(gameTeam, newPoints);

    await thisShopItem.delete();

    const serverAction: ShopRefundAction = {
        type: SHOP_REFUND,
        payload: {
            shopItemId, // is this used on the frontend?
            pointsAdded: itemCost
        }
    };

    // Send update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
