import { Socket } from 'socket.io';
import { BLUE_TEAM_ID, PURCHASE_PHASE_ID, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION, TYPE_COSTS, TYPE_MAIN } from '../../../constants';
import { ShopPurchaseAction, ShopPurchaseRequestAction } from '../../../react-client/src/interfaces/interfaces';
import { SHOP_PURCHASE } from '../../../react-client/src/redux/actions/actionTypes';
import { GameSession } from '../../../types/sessionTypes';
import { Game, ShopItem } from '../../classes';
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG } from '../../pages/errorTypes';
import { sendUserFeedback } from '../sendUserFeedback';

/**
 * Client is requesting to buy something from the shop and place it into their cart. (Insert ShopItem)
 */
export const shopPurchaseRequest = async (socket: Socket, action: ShopPurchaseRequestAction) => {
    // Grab the session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    if (action.payload == null || action.payload.shopItemTypeId == null) {
        sendUserFeedback(socket, 'Server Error: Malformed Payload (missing shopItemTypeId)');
        return;
    }

    const { shopItemTypeId } = action.payload;

    // Grab the Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, game0Points, game1Points } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    if (gamePhase !== PURCHASE_PHASE_ID) {
        sendUserFeedback(socket, 'Not the right phase...');
        return;
    }

    // Only the main controller (0) can buy things
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, 'Not the main controller (0)...');
        return;
    }

    const shopItemCost = TYPE_COSTS[shopItemTypeId];
    const teamPoints = gameTeam === BLUE_TEAM_ID ? game0Points : game1Points;

    if (teamPoints < shopItemCost) {
        sendUserFeedback(socket, 'Not enough points to purchase');
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
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default shopPurchaseRequest;
