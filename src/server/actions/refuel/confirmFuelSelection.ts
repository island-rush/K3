// prettier-ignore
import { COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, TYPE_AIR } from '../../../constants';
import { ConfirmFuelSelectionRequestAction, SocketSession } from '../../../types';
import { Game } from '../../classes';
import { redirectClient, sendUserFeedback } from '../../helpers';

/**
 * Client Request to transfer fuel from tankers to other aircraft. Finishes a Refuel Event
 */
export const confirmFuelSelection = async (session: SocketSession, action: ConfirmFuelSelectionRequestAction) => {
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

    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Wrong phase for refueling.');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    if (!gameControllers.includes(TYPE_AIR)) {
        sendUserFeedback(socketId, 'Need to be air commander.');
        return;
    }

    // const thisRefuelEvent = await Event.getNext(gameId, gameTeam); // TODO: this could be an unecessary call (if we move the refuel functionality out of the event class)

    // handle the payload and stuff, send the response (with next event?) (or 2 responses...)
    const { aircraft } = action.payload;
    console.log(aircraft);
    // TODO: go through fuelSelections and make sure it makes sense from backend (security)
    // ex: these pieces exist, these fuel amounts aren't beyond tanker fuel (can't drain tanker, or add fuel from nothing)
    // basically make sure no cheating...
    // but right now we'll assume its all good (to get it working...)
    // need to check each of the pieces? (we own them...they have the fuel we think they are giving...stuff like that)

    // fuelSelection (predicted)
    // let fuelSelections = [
    //     {
    //         pieceId: 1,
    //   piecePositionId: 10, //need this to help with frontend update, should always know this...
    //         newFuel: 10
    //     },
    //     {
    //         pieceId: 2,
    //   piecePositionId: 10,
    //         newFuel: 5
    //     }
    // ];

    // TODO: ideally would re-grab all the values from the database (like to check types and things...and pieceFuel)

    // const fuelSelections: {
    //     pieceId: PieceType['pieceId'];
    //     piecePositionId: PieceType['piecePositionId'];
    //     newFuel: PieceType['pieceFuel'];
    // }[] = [];
    // for (let x = 0; x < aircraft.length; x++) {
    //     // add a thing to fuelSelections (pieceInfo, as well as newFuel?)
    //     const thisAircraft = aircraft[x];
    //     const { pieceId, piecePositionId, pieceTypeId, tankerPieceId } = thisAircraft;
    //     if (tankerPieceId != null) {
    //         const newFuel = TYPE_FUEL[pieceTypeId];
    //         fuelSelections.push({
    //             pieceId,
    //             piecePositionId,
    //             newFuel
    //         });
    //     }
    // }
    // for (let y = 0; y < tankers.length; y++) {
    //     const thisTanker = tankers[y];
    //     const { pieceId, piecePositionId, pieceFuel, removedFuel } = thisTanker;
    //     if (removedFuel != null && removedFuel !== 0) {
    //         const newFuel = pieceFuel - removedFuel;
    //         fuelSelections.push({
    //             pieceId,
    //             piecePositionId,
    //             newFuel
    //         });
    //     }
    // }

    // // If there are updates to send
    // if (fuelSelections.length !== 0) {
    //     await thisRefuelEvent.bulkUpdatePieceFuels(fuelSelections, gameTeam);

    //     // now give those fuel updates to the client side (nothing too visible, pieces just update)
    //     // don't let client assume things went well, must get things back from server to confirm

    //     // TODO: better payloads?
    //     if (fuelSelections.length > 0) {
    //         const serverAction: FuelResultsAction = {
    //             type: REFUEL_RESULTS,
    //             payload: {
    //                 fuelUpdates: fuelSelections // TODO: this should be the server's own record, not just sending back to client
    //             }
    //         };

    //         // sending results and no matter what, going to next event (refuel isn't multiple things, its 1 and done)
    //         sendToTeam(gameId, gameTeam, serverAction);
    //     }
    // }

    // TODO: would be more efficient to put the REFUEL_RESULTS into the next event action, 1 request instead of 2 (make sure to remember to include new piece positions if do things here)

    // await thisRefuelEvent.delete();
    // await giveNextEvent(session, { thisGame, gameTeam }); // not putting executingStep in options to let it know not to send pieceMove
};
