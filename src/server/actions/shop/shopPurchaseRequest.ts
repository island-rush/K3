// prettier-ignore
import { BLUE_TEAM_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, PURCHASE_PHASE_ID, SHOP_PURCHASE, TYPE_COSTS, TYPE_MAIN, NOT_WAITING_STATUS } from '../../../constants';
import { ShopPurchaseAction, ShopPurchaseRequestAction, SocketSession } from '../../../types';
import { Game, ShopItem } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * Client is requesting to buy something from the shop and place it into their cart. (Insert ShopItem)
 */
export const shopPurchaseRequest = async (session: SocketSession, action: ShopPurchaseRequestAction) => {
    // Grab the session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    if (action.payload == null || action.payload.shopItemTypeId == null) {
        sendUserFeedback(socketId, 'Server Error: Malformed Payload (missing shopItemTypeId)');
        return;
    }

    const { shopItemTypeId } = action.payload;

    // Grab the Game
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

    // Only the main controller (0) can buy things
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socketId, 'Not the main controller (0)...');
        return;
    }

    const shopItemCost = TYPE_COSTS[shopItemTypeId];
    const teamPoints = gameTeam === BLUE_TEAM_ID ? gameBluePoints : gameRedPoints;

    if (teamPoints < shopItemCost) {
        sendUserFeedback(socketId, 'Not enough points to purchase');
        return;
    }

    const newPoints = teamPoints - shopItemCost;
    await thisGame.setPoints(gameTeam, newPoints);

    // TODO: possible error checking if was unable to insert the piece? (don't setPoints until inserted...)
    const shopItem = await ShopItem.insert(gameId, gameTeam, shopItemTypeId);

    const serverAction: ShopPurchaseAction = {
        type: SHOP_PURCHASE,
        payload: {
            shopItem,
            points: newPoints
        }
    };

    // Send update to client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
