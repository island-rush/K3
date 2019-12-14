/**
 * This function configures a Socket to respond to client requests.
 */

import { Socket } from "socket.io";
import { Game } from "./classes";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION, SOCKET_CLIENT_SENDING_ACTION } from "../react-client/src/constants/otherConstants";
import { LOGGED_IN_VALUE, NOT_LOGGED_IN_VALUE } from "../react-client/src/constants/gameConstants";
import { BAD_SESSION, GAME_DOES_NOT_EXIST, NOT_LOGGED_IN_TAG } from "./pages/errorTypes";
//prettier-ignore
import {SERVER_BIOLOGICAL_WEAPONS_CONFIRM,SERVER_INSURGENCY_CONFIRM,SERVER_REMOTE_SENSING_CONFIRM,SERVER_RODS_FROM_GOD_CONFIRM,SERVER_CONFIRM_FUEL_SELECTION,SERVER_CONFIRM_BATTLE_SELECTION,SERVER_MAIN_BUTTON_CLICK,SERVER_PIECE_PLACE,SERVER_DELETE_PLAN,SERVER_CONFIRM_PLAN,SERVER_SHOP_CONFIRM_PURCHASE,SERVER_SHOP_REFUND_REQUEST,SERVER_SHOP_PURCHASE_REQUEST,SERVER_RAISE_MORALE_CONFIRM,SERVER_COMM_INTERRUPT_CONFIRM,SERVER_GOLDEN_EYE_CONFIRM,SERVER_OUTER_PIECE_CLICK,SERVER_INNER_PIECE_CLICK,SERVER_INNER_TRANSPORT_PIECE_CLICK } from "../react-client/src/redux/actions/actionTypes";
//prettier-ignore
import {sendUserFeedback,shopPurchaseRequest,shopRefundRequest,shopConfirmPurchase,confirmPlan,deletePlan,piecePlace,mainButtonClick,confirmBattleSelection,confirmFuelSelection,rodsFromGodConfirm,remoteSensingConfirm,insurgencyConfirm,biologicalWeaponsConfirm,raiseMoraleConfirm,commInterruptConfirm,goldenEyeConfirm,enterContainer,exitContainer,exitTransportContainer} from "./actions";

const socketSetup = async (socket: Socket) => {
    //Verify that this user has correct session variables
    if (
        !socket.handshake.session.ir3 ||
        !socket.handshake.session.ir3.gameId ||
        !socket.handshake.session.ir3.gameTeam ||
        !socket.handshake.session.ir3.gameControllers
    ) {
        socket.emit(SOCKET_SERVER_REDIRECT, BAD_SESSION);
        return;
    }

    //Extract information from session
    const ir3Session: { gameId: number; gameTeam: number; gameControllers: number[] } = socket.handshake.session.ir3;
    const { gameId, gameTeam, gameControllers } = ir3Session;

    //Get information about the game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    //Verify they are logged in
    for (let gameController of gameControllers) {
        if (!thisGame.getLoggedIn(gameTeam, gameController)) {
            socket.emit(SOCKET_SERVER_REDIRECT, NOT_LOGGED_IN_TAG);
            return;
        } else {
            //probably refreshed, keep them logged in (disconnect logs them out)
            setTimeout(() => {
                thisGame.setLoggedIn(gameTeam, gameController, LOGGED_IN_VALUE);
                socket.handshake.session.ir3 = ir3Session;
            }, 5000);
        }
    }

    //Socket Room for the whole Game and for individual team
    socket.join("game" + gameId);
    socket.join("game" + gameId + "team" + gameTeam);

    //Send the client intial game state data
    const serverAction = await thisGame.initialStateAction(gameTeam, gameControllers);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);

    //Setup the socket functions to respond to client requests
    socket.on(SOCKET_CLIENT_SENDING_ACTION, ({ type, payload }) => {
        try {
            switch (type) {
                case SERVER_SHOP_PURCHASE_REQUEST:
                    shopPurchaseRequest(socket, payload);
                    break;
                case SERVER_SHOP_REFUND_REQUEST:
                    shopRefundRequest(socket, payload);
                    break;
                case SERVER_SHOP_CONFIRM_PURCHASE:
                    shopConfirmPurchase(socket, payload);
                    break;
                case SERVER_CONFIRM_PLAN:
                    confirmPlan(socket, payload);
                    break;
                case SERVER_DELETE_PLAN:
                    deletePlan(socket, payload);
                    break;
                case SERVER_PIECE_PLACE:
                    piecePlace(socket, payload);
                    break;
                case SERVER_MAIN_BUTTON_CLICK:
                    mainButtonClick(socket, payload);
                    break;
                case SERVER_CONFIRM_BATTLE_SELECTION:
                    confirmBattleSelection(socket, payload);
                    break;
                case SERVER_CONFIRM_FUEL_SELECTION:
                    confirmFuelSelection(socket, payload);
                    break;
                case SERVER_RODS_FROM_GOD_CONFIRM:
                    rodsFromGodConfirm(socket, payload);
                    break;
                case SERVER_REMOTE_SENSING_CONFIRM:
                    remoteSensingConfirm(socket, payload);
                    break;
                case SERVER_INSURGENCY_CONFIRM:
                    insurgencyConfirm(socket, payload);
                    break;
                case SERVER_BIOLOGICAL_WEAPONS_CONFIRM:
                    biologicalWeaponsConfirm(socket, payload);
                    break;
                case SERVER_RAISE_MORALE_CONFIRM:
                    raiseMoraleConfirm(socket, payload);
                    break;
                case SERVER_COMM_INTERRUPT_CONFIRM:
                    commInterruptConfirm(socket, payload);
                    break;
                case SERVER_GOLDEN_EYE_CONFIRM:
                    goldenEyeConfirm(socket, payload);
                    break;
                case SERVER_OUTER_PIECE_CLICK:
                    enterContainer(socket, payload);
                    break;
                case SERVER_INNER_PIECE_CLICK:
                    exitContainer(socket, payload);
                    break;
                case SERVER_INNER_TRANSPORT_PIECE_CLICK:
                    exitTransportContainer(socket, payload);
                    break;
                default:
                    sendUserFeedback(socket, "Did not recognize client socket request type");
            }
        } catch (error) {
            console.error(error);
            sendUserFeedback(socket, `INTERNAL SERVER ERROR: CHECK DATABASE -> error: ${error}`);
        }
    });

    //Automatically Logout this person when their socket disconnects from the server (after 5 seconds to allow for refreshing)
    socket.on("disconnect", async () => {
        try {
            setTimeout(() => {
                for (let gameController of gameControllers) {
                    thisGame.setLoggedIn(gameTeam, gameController, NOT_LOGGED_IN_VALUE);
                }
                delete socket.handshake.session.ir3;
            }, 5000);
        } catch (error) {
            //TODO: log errors to a file (for production/deployment reasons)
            console.error(error);
        }
    });
};

export default socketSetup;
