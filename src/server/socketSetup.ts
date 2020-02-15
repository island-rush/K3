import { Socket } from 'socket.io';
// prettier-ignore
import { BAD_SESSION, GAME_DOES_NOT_EXIST, LOGGED_IN_VALUE, NOT_LOGGED_IN_TAG, NOT_LOGGED_IN_VALUE, SOCKET_CLIENT_SENDING_ACTION, SOCKET_SERVER_REDIRECT } from '../constants';
// prettier-ignore
import { GameInitialStateAction, GameSession, SERVER_ANTISAT_CONFIRM, SERVER_ATC_SCRAMBLE_CONFIRM, SERVER_BIOLOGICAL_WEAPONS_CONFIRM, SERVER_BOMBARDMENT_CONFIRM, SERVER_COMM_INTERRUPT_CONFIRM, SERVER_CONFIRM_BATTLE_SELECTION, SERVER_CONFIRM_FUEL_SELECTION, SERVER_CONFIRM_PLAN, SERVER_CYBER_DEFENSE_CHECK, SERVER_CYBER_DEFENSE_CONFIRM, SERVER_DELETE_PLAN, SERVER_DRONE_SWARM_CONFIRM, SERVER_GOLDEN_EYE_CONFIRM, SERVER_INNER_PIECE_CLICK, SERVER_INNER_TRANSPORT_PIECE_CLICK, SERVER_INSURGENCY_CONFIRM, SERVER_MAIN_BUTTON_CLICK, SERVER_MISSILE_CONFIRM, SERVER_MISSILE_DISRUPT_CONFIRM, SERVER_NUKE_CONFIRM, SERVER_OUTER_PIECE_CLICK, SERVER_PIECE_PLACE, SERVER_RAISE_MORALE_CONFIRM, SERVER_REMOTE_SENSING_CONFIRM, SERVER_RODS_FROM_GOD_CONFIRM, SERVER_SEA_MINE_CONFIRM, SERVER_SHOP_CONFIRM_PURCHASE, SERVER_SHOP_PURCHASE_REQUEST, SERVER_SHOP_REFUND_REQUEST, SocketSession } from '../types';
// prettier-ignore
import { antiSatConfirm, atcScrambleConfirm, biologicalWeaponsConfirm, bombardmentConfirm, checkCyberDefense, commInterruptConfirm, confirmBattleSelection, confirmFuelSelection, confirmPlan, cyberDefenseConfirm, deletePlan, droneSwarmConfirm, enterContainer, exitContainer, exitTransportContainer, goldenEyeConfirm, insurgencyConfirm, mainButtonClick, missileAttackConfirm, missileDisruptConfirm, nukeConfirm, piecePlace, raiseMoraleConfirm, remoteSensingConfirm, rodsFromGodConfirm, seaMineConfirm, sendUserFeedback, shopConfirmPurchase, shopPurchaseRequest, shopRefundRequest } from './actions';
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
    const thisGame = await new Game(gameId).init(); // TODO: may need try catches on all async functions (possibly at lowest level of functions -> where .init() is declared?)
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

    // Socket Room for individual controllers (in case need to force logout)
    for (const gameController of gameControllers) {
        socket.join(`game${gameId}team${gameTeam}controller${gameController}`);
    }

    // Add socketId to session information
    socket.handshake.session.socketId = socket.id;

    // Send the client intial game state data
    try {
        const serverAction: GameInitialStateAction = await thisGame.initialStateAction(gameTeam, gameControllers);
        sendToClient(socket.id, serverAction);
    } catch (error) {
        console.error('Was not able to send initial game state data, possibly due to missing db tables (usually the case but idk');
        console.error(error.code);
        console.error(error.message);
        console.error('recommend resetting the db, or reading the error posted above to be sure.');
    }

    // Setup the socket functions to respond to client requests
    socket.on(SOCKET_CLIENT_SENDING_ACTION, ({ type, payload }: { type: string; payload: any }) => {
        try {
            const userSession = socket.handshake.session as SocketSession;

            switch (type) {
                case SERVER_SHOP_PURCHASE_REQUEST:
                    shopPurchaseRequest(userSession, { type, payload });
                    break;
                case SERVER_SHOP_REFUND_REQUEST:
                    shopRefundRequest(userSession, { type, payload });
                    break;
                case SERVER_SHOP_CONFIRM_PURCHASE:
                    shopConfirmPurchase(userSession);
                    break;
                case SERVER_CONFIRM_PLAN:
                    confirmPlan(userSession, { type, payload });
                    break;
                case SERVER_DELETE_PLAN:
                    deletePlan(userSession, { type, payload });
                    break;
                case SERVER_PIECE_PLACE:
                    piecePlace(userSession, { type, payload });
                    break;
                case SERVER_MAIN_BUTTON_CLICK:
                    mainButtonClick(userSession);
                    break;
                case SERVER_CONFIRM_BATTLE_SELECTION:
                    confirmBattleSelection(userSession, { type, payload });
                    break;
                case SERVER_CONFIRM_FUEL_SELECTION:
                    confirmFuelSelection(userSession, { type, payload });
                    break;
                case SERVER_RODS_FROM_GOD_CONFIRM:
                    rodsFromGodConfirm(userSession, { type, payload });
                    break;
                case SERVER_REMOTE_SENSING_CONFIRM:
                    remoteSensingConfirm(userSession, { type, payload });
                    break;
                case SERVER_INSURGENCY_CONFIRM:
                    insurgencyConfirm(userSession, { type, payload });
                    break;
                case SERVER_BIOLOGICAL_WEAPONS_CONFIRM:
                    biologicalWeaponsConfirm(userSession, { type, payload });
                    break;
                case SERVER_RAISE_MORALE_CONFIRM:
                    raiseMoraleConfirm(userSession, { type, payload });
                    break;
                case SERVER_COMM_INTERRUPT_CONFIRM:
                    commInterruptConfirm(userSession, { type, payload });
                    break;
                case SERVER_GOLDEN_EYE_CONFIRM:
                    goldenEyeConfirm(userSession, { type, payload });
                    break;
                case SERVER_SEA_MINE_CONFIRM:
                    seaMineConfirm(userSession, { type, payload });
                    break;
                case SERVER_DRONE_SWARM_CONFIRM:
                    droneSwarmConfirm(userSession, { type, payload });
                    break;
                case SERVER_OUTER_PIECE_CLICK:
                    enterContainer(userSession, { type, payload });
                    break;
                case SERVER_INNER_PIECE_CLICK:
                    exitContainer(userSession, { type, payload });
                    break;
                case SERVER_INNER_TRANSPORT_PIECE_CLICK:
                    exitTransportContainer(userSession, { type, payload });
                    break;
                case SERVER_ATC_SCRAMBLE_CONFIRM:
                    atcScrambleConfirm(userSession, { type, payload });
                    break;
                case SERVER_NUKE_CONFIRM:
                    nukeConfirm(userSession, { type, payload });
                    break;
                case SERVER_MISSILE_CONFIRM:
                    missileAttackConfirm(userSession, { type, payload });
                    break;
                case SERVER_BOMBARDMENT_CONFIRM:
                    bombardmentConfirm(userSession, { type, payload });
                    break;
                case SERVER_ANTISAT_CONFIRM:
                    antiSatConfirm(userSession, { type, payload });
                    break;
                case SERVER_MISSILE_DISRUPT_CONFIRM:
                    missileDisruptConfirm(userSession, { type, payload });
                    break;
                case SERVER_CYBER_DEFENSE_CONFIRM:
                    cyberDefenseConfirm(userSession, { type, payload });
                    break;
                case SERVER_CYBER_DEFENSE_CHECK:
                    checkCyberDefense(userSession, { type, payload });
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
