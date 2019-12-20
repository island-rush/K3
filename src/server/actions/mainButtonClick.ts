import { AnyAction } from "redux";
import { Socket } from "socket.io";
//prettier-ignore
import { BLUE_TEAM_ID, COMBAT_PHASE_ID, NEWS_PHASE_ID, NOT_WAITING_STATUS, PLACE_PHASE_ID, PURCHASE_PHASE_ID, RED_TEAM_ID, SLICE_EXECUTING_ID, SLICE_PLANNING_ID, TYPE_MAIN, WAITING_STATUS } from "../../react-client/src/constants/gameConstants";
import { GameSession } from "../../react-client/src/constants/interfaces";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../react-client/src/constants/otherConstants";
import { COMBAT_PHASE, MAIN_BUTTON_CLICK, NEWS_PHASE, PURCHASE_PHASE, SLICE_CHANGE } from "../../react-client/src/redux/actions/actionTypes";
import { Capability, Game, Piece } from "../classes";
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG } from "../pages/errorTypes";
import executeStep from "./executeStep";
import sendUserFeedback from "./sendUserFeedback";

const mainButtonClick = async (socket: Socket, action: AnyAction) => {
    //Verify Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    //Get Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice, game0Status, game1Status } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //Who is allowed to press that button?
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, "Wrong Controller to click that button...");
        return;
    }

    const otherTeam = gameTeam == BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;
    const thisTeamStatus = gameTeam == BLUE_TEAM_ID ? game0Status : game1Status;
    const otherTeamStatus = otherTeam == BLUE_TEAM_ID ? game0Status : game1Status;

    if (thisTeamStatus == WAITING_STATUS) {
        //might fail with race condition (they press at the same time...but they just need to keep pressing...)
        sendUserFeedback(socket, "Still waiting on other team...");
        return;
    }

    //Now Waiting
    if (otherTeamStatus == NOT_WAITING_STATUS) {
        await thisGame.setStatus(gameTeam, WAITING_STATUS);
        const serverAction: AnyAction = {
            type: MAIN_BUTTON_CLICK,
            payload: {}
        };
        socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
        return;
    }

    //Everyone is ready to move on
    await thisGame.setStatus(otherTeam, NOT_WAITING_STATUS);
    await thisGame.setStatus(gameTeam, NOT_WAITING_STATUS);

    let serverAction0: AnyAction;
    let serverAction1: AnyAction;

    switch (gamePhase) {
        case NEWS_PHASE_ID:
            await thisGame.setPhase(PURCHASE_PHASE_ID);
            serverAction0 = serverAction1 = {
                type: PURCHASE_PHASE,
                payload: {}
            };
            break;

        case PURCHASE_PHASE_ID:
            await thisGame.setPhase(COMBAT_PHASE_ID);

            //probably do this again anyway (pieces have been placed and could be seeing things now)
            await Piece.updateVisibilities(gameId);

            serverAction0 = {
                type: COMBAT_PHASE,
                payload: {
                    gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID)
                }
            };
            serverAction1 = {
                type: COMBAT_PHASE,
                payload: {
                    gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID)
                }
            };
            break;

        //Combat Phase -> Slice, Round, Place Troops... (stepping through)
        case COMBAT_PHASE_ID:
            if (gameSlice == SLICE_PLANNING_ID) {
                await thisGame.setSlice(SLICE_EXECUTING_ID);

                //TODO: change payload to reflect what's being sent (confirmedRods = list of positions, confirmedInsurgency = list of pieces to delete)
                const confirmedRods = await Capability.useRodsFromGod(gameId);
                const confirmedBioWeapons = await Capability.useBiologicalWeapons(gameId);
                const confirmedGoldenEye = await Capability.useGoldenEye(gameId);
                const confirmedCommInterrupt = await Capability.useCommInterrupt(gameId);
                const { listOfPiecesToKill, listOfEffectedPositions } = await Capability.useInsurgency(gameId);

                serverAction0 = {
                    type: SLICE_CHANGE,
                    payload: {
                        confirmedRods,
                        confirmedBioWeapons,
                        confirmedGoldenEye,
                        confirmedCommInterrupt,
                        confirmedInsurgencyPos: listOfEffectedPositions,
                        confirmedInsurgencyPieces: listOfPiecesToKill,
                        gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID)
                    }
                };
                serverAction1 = {
                    type: SLICE_CHANGE,
                    payload: {
                        confirmedRods,
                        confirmedBioWeapons,
                        confirmedGoldenEye,
                        confirmedCommInterrupt,
                        confirmedInsurgencyPos: listOfEffectedPositions,
                        confirmedInsurgencyPieces: listOfPiecesToKill,
                        gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID)
                    }
                };
            } else {
                await executeStep(socket, thisGame);
                return; //executeStep will handle sending socket stuff, most likely separate for each client
            }
            break;

        //Place Troops -> News
        case PLACE_PHASE_ID:
            await thisGame.addPoints();
            await thisGame.setPhase(NEWS_PHASE_ID);
            const news = await thisGame.getNextNews();
            serverAction0 = {
                type: NEWS_PHASE,
                payload: {
                    news,
                    gamePoints: thisGame.game0Points
                }
            };
            serverAction1 = {
                type: NEWS_PHASE,
                payload: {
                    news,
                    gamePoints: thisGame.game1Points
                }
            };
            break;

        default:
            sendUserFeedback(socket, "Backend Failure, unkown gamePhase...");
            return;
    }

    //Send to all clients (could be different from getting points)
    socket.to("game" + gameId + "team" + BLUE_TEAM_ID).emit(SOCKET_SERVER_SENDING_ACTION, serverAction0);
    socket.to("game" + gameId + "team" + RED_TEAM_ID).emit(SOCKET_SERVER_SENDING_ACTION, serverAction1);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, gameTeam === BLUE_TEAM_ID ? serverAction0 : serverAction1);
};

export default mainButtonClick;
