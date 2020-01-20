import { Socket } from 'socket.io';
// prettier-ignore
import { BAD_SESSION, GAME_DOES_NOT_EXIST, LOGGED_IN_VALUE, NOT_LOGGED_IN_TAG, NOT_LOGGED_IN_VALUE, SERVER_ATC_SCRAMBLE_CONFIRM, SERVER_BIOLOGICAL_WEAPONS_CONFIRM, SERVER_COMM_INTERRUPT_CONFIRM, SERVER_CONFIRM_BATTLE_SELECTION, SERVER_CONFIRM_FUEL_SELECTION, SERVER_CONFIRM_PLAN, SERVER_DELETE_PLAN, SERVER_DRONE_SWARM_CONFIRM, SERVER_GOLDEN_EYE_CONFIRM, SERVER_INNER_PIECE_CLICK, SERVER_INNER_TRANSPORT_PIECE_CLICK, SERVER_INSURGENCY_CONFIRM, SERVER_MAIN_BUTTON_CLICK, SERVER_OUTER_PIECE_CLICK, SERVER_PIECE_PLACE, SERVER_RAISE_MORALE_CONFIRM, SERVER_REMOTE_SENSING_CONFIRM, SERVER_RODS_FROM_GOD_CONFIRM, SERVER_SEA_MINE_CONFIRM, SERVER_SHOP_CONFIRM_PURCHASE, SERVER_SHOP_PURCHASE_REQUEST, SERVER_SHOP_REFUND_REQUEST, SOCKET_CLIENT_SENDING_ACTION, SOCKET_SERVER_REDIRECT } from '../constants';
import { GameInitialStateAction, GameSession, SocketSession } from '../types';
// prettier-ignore
import { atcScrambleConfirm, biologicalWeaponsConfirm, commInterruptConfirm, confirmBattleSelection, confirmFuelSelection, confirmPlan, deletePlan, droneSwarmConfirm, enterContainer, exitContainer, exitTransportContainer, goldenEyeConfirm, insurgencyConfirm, mainButtonClick, piecePlace, raiseMoraleConfirm, remoteSensingConfirm, rodsFromGodConfirm, seaMineConfirm, sendUserFeedback, shopConfirmPurchase, shopPurchaseRequest, shopRefundRequest } from './actions';
import { Game } from './classes';
import { redirectClient, sendToClient } from './helpers';

/**
 * Configures a socket to handle game requests between client and server.
 */
export const socketSetup = async (socket: Socket) => {
    // Verify Session Exists
    if (!socket.handshake.session.ir3) {
        socket.emit(SOCKET_SERVER_REDIRECT, BAD_SESSION);
        return;
    }

    // Extract information from session
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3 as GameSession;

    // Get the game
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        redirectClient(socket.id, GAME_DOES_NOT_EXIST);
        return;
    }

    // Verify they are logged in
    for (const gameController of gameControllers) {
        if (!thisGame.getLoggedIn(gameTeam, gameController)) {
            socket.emit(SOCKET_SERVER_REDIRECT, NOT_LOGGED_IN_TAG);
            return;
        }
        // probably refreshed, keep them logged in (disconnect logs them out) (make sure the session is re-saved to old value)
        setTimeout(() => {
            thisGame.setLoggedIn(gameTeam, gameController, LOGGED_IN_VALUE);
            socket.handshake.session.ir3 = socket.handshake.session.ir3;
        }, 5000);
    }

    // Socket Room for the whole game and for individual team (so we can send updates later)
    socket.join(`game${gameId}`);
    socket.join(`game${gameId}team${gameTeam}`);

    // Add socketId to session information
    socket.handshake.session.socketId = socket.id;

    // Send the client intial game state data
    const serverAction: GameInitialStateAction = await thisGame.initialStateAction(gameTeam, gameControllers);
    sendToClient(socket.id, serverAction);

    // Setup the socket functions to respond to client requests
    // TODO: combine all possible payloads into a type and use that instead of any, could also combine other types and use instead of string
    socket.on(SOCKET_CLIENT_SENDING_ACTION, ({ type, payload }: { type: string; payload: any }) => {
        try {
            switch (type) {
                case SERVER_SHOP_PURCHASE_REQUEST:
                    shopPurchaseRequest(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_SHOP_REFUND_REQUEST:
                    shopRefundRequest(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_SHOP_CONFIRM_PURCHASE:
                    shopConfirmPurchase(socket.handshake.session as SocketSession);
                    break;
                case SERVER_CONFIRM_PLAN:
                    confirmPlan(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_DELETE_PLAN:
                    deletePlan(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_PIECE_PLACE:
                    piecePlace(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_MAIN_BUTTON_CLICK:
                    mainButtonClick(socket.handshake.session as SocketSession);
                    break;
                case SERVER_CONFIRM_BATTLE_SELECTION:
                    confirmBattleSelection(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_CONFIRM_FUEL_SELECTION:
                    confirmFuelSelection(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_RODS_FROM_GOD_CONFIRM:
                    rodsFromGodConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_REMOTE_SENSING_CONFIRM:
                    remoteSensingConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_INSURGENCY_CONFIRM:
                    insurgencyConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_BIOLOGICAL_WEAPONS_CONFIRM:
                    biologicalWeaponsConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_RAISE_MORALE_CONFIRM:
                    raiseMoraleConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_COMM_INTERRUPT_CONFIRM:
                    commInterruptConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_GOLDEN_EYE_CONFIRM:
                    goldenEyeConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_SEA_MINE_CONFIRM:
                    seaMineConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_DRONE_SWARM_CONFIRM:
                    droneSwarmConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_OUTER_PIECE_CLICK:
                    enterContainer(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_INNER_PIECE_CLICK:
                    exitContainer(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_INNER_TRANSPORT_PIECE_CLICK:
                    exitTransportContainer(socket.handshake.session as SocketSession, { type, payload });
                    break;
                case SERVER_ATC_SCRAMBLE_CONFIRM:
                    atcScrambleConfirm(socket.handshake.session as SocketSession, { type, payload });
                    break;
                default:
                    sendUserFeedback(socket.id, 'Did not recognize client socket request type');
            }
        } catch (error) {
            console.error(error);
            sendUserFeedback(socket.id, `INTERNAL SERVER ERROR: CHECK DATABASE -> error: ${error}`);
        }
    });

    // Automatically Logout this person when their socket disconnects from the server (after 5 seconds to allow for refreshing)
    socket.on('disconnect', async () => {
        try {
            setTimeout(() => {
                for (const gameController of gameControllers) {
                    thisGame.setLoggedIn(gameTeam, gameController, NOT_LOGGED_IN_VALUE);
                }
                delete socket.handshake.session.ir3;
            }, 5000);
            delete socket.handshake.session.socketId;
        } catch (error) {
            // TODO: log errors to a file (for production/deployment reasons)
            console.error(error);
        }
    });
};
