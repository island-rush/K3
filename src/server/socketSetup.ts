import { Socket } from "socket.io";

const socketSetup = async (socket: Socket) => {
    // //Verify that this user is authenticated / known
    // if (!socket.handshake.session.ir3 || !socket.handshake.session.ir3.gameId || !socket.handshake.session.ir3.gameTeam || !socket.handshake.session.ir3.gameControllers) {
    //     socket.emit(SOCKET_SERVER_REDIRECT, BAD_SESSION);
    //     return;
    // }
    // const ir3Session = socket.handshake.session.ir3;
    // const { gameId, gameTeam, gameControllers } = ir3Session; //get the user's information
    // const thisGame = await new Game({ gameId }).init(); //get the Game
    // if (!thisGame) {
    //     //unlikely, since we just came from gameLogin successfully
    //     socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
    //     return;
    // }
    // let gameController;
    // for (gameController of gameControllers) {
    //     let loggedIn = thisGame["game" + gameTeam + "Controller" + gameController];
    //     //Session doesn't match DB, another player could login again as this controller (since login only checks db values)
    //     if (!loggedIn) {
    //         socket.emit(SOCKET_SERVER_REDIRECT, NOT_LOGGED_IN_TAG);
    //         return;
    //     } else {
    //         //probably refreshed, keep them logged in (disconnect logs them out)
    //         setTimeout(() => {
    //             thisGame.setLoggedIn(gameTeam, gameController, 1);
    //             socket.handshake.session.ir3 = ir3Session;
    //         }, 5000);
    //     }
    // }
    // //Socket Room for the Game
    // socket.join("game" + gameId);
    // //Socket Room for the Team
    // socket.join("game" + gameId + "team" + gameTeam);
    // //Socket Room for the Indiviual Controller
    // //TODO: multiple rooms for a single socket if logged in as multiple controllers (is this needed in the game?)
    // // socket.join("game" + gameId + "team" + gameTeam + "controller" + gameController);
    // //Send the client intial game state data
    // const serverAction = await thisGame.initialStateAction(gameTeam, gameControllers);
    // socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction); //sends the data
    // //Setup the socket functions to respond to client requests
    // socket.on(SOCKET_CLIENT_SENDING_ACTION, ({ type, payload }) => {
    //     try {
    //         switch (type) {
    //             case SERVER_SHOP_PURCHASE_REQUEST:
    //                 shopPurchaseRequest(socket, payload);
    //                 break;
    //             case SERVER_SHOP_REFUND_REQUEST:
    //                 shopRefundRequest(socket, payload);
    //                 break;
    //             case SERVER_SHOP_CONFIRM_PURCHASE:
    //                 shopConfirmPurchase(socket, payload);
    //                 break;
    //             case SERVER_CONFIRM_PLAN:
    //                 confirmPlan(socket, payload);
    //                 break;
    //             case SERVER_DELETE_PLAN:
    //                 deletePlan(socket, payload);
    //                 break;
    //             case SERVER_PIECE_PLACE:
    //                 piecePlace(socket, payload);
    //                 break;
    //             case SERVER_MAIN_BUTTON_CLICK:
    //                 mainButtonClick(socket, payload);
    //                 break;
    //             case SERVER_CONFIRM_BATTLE_SELECTION:
    //                 confirmBattleSelection(socket, payload);
    //                 break;
    //             case SERVER_CONFIRM_FUEL_SELECTION:
    //                 confirmFuelSelection(socket, payload);
    //                 break;
    //             case SERVER_RODS_FROM_GOD_CONFIRM:
    //                 rodsFromGodConfirm(socket, payload);
    //                 break;
    //             case SERVER_REMOTE_SENSING_CONFIRM:
    //                 remoteSensingConfirm(socket, payload);
    //                 break;
    //             case SERVER_INSURGENCY_CONFIRM:
    //                 insurgencyConfirm(socket, payload);
    //                 break;
    //             case SERVER_BIOLOGICAL_WEAPONS_CONFIRM:
    //                 biologicalWeaponsConfirm(socket, payload);
    //                 break;
    //             case SERVER_RAISE_MORALE_CONFIRM:
    //                 raiseMoraleConfirm(socket, payload);
    //                 break;
    //             case SERVER_COMM_INTERRUPT_CONFIRM:
    //                 commInterruptConfirm(socket, payload);
    //                 break;
    //             case SERVER_GOLDEN_EYE_CONFIRM:
    //                 goldenEyeConfirm(socket, payload);
    //                 break;
    //             case SERVER_OUTER_PIECE_CLICK:
    //                 enterContainer(socket, payload);
    //                 break;
    //             case SERVER_INNER_PIECE_CLICK:
    //                 exitContainer(socket, payload);
    //                 break;
    //             case SERVER_INNER_TRANSPORT_PIECE_CLICK:
    //                 exitTransportContainer(socket, payload);
    //                 break;
    //             default:
    //                 sendUserFeedback(socket, "Did not recognize client socket request type");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         sendUserFeedback(socket, `INTERNAL SERVER ERROR: CHECK DATABASE -> error: ${error}`);
    //     }
    // });
    // //Automatically Logout this person (from database) when their socket disconnects from the server
    // socket.on("disconnect", async () => {
    //     try {
    //         setTimeout(() => {
    //             for (gameController of gameControllers) {
    //                 thisGame.setLoggedIn(gameTeam, gameController, 0);
    //             }
    //             delete socket.handshake.session.ir3;
    //         }, 5000);
    //     } catch (error) {
    //         //TODO: log errors to a file (for production/deployment reasons)
    //         console.error(error);
    //     }
    // });
};

export default socketSetup;
