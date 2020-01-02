import { Socket } from 'socket.io';
// prettier-ignore
import { COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, REFUEL_RESULTS, TYPE_AIR, TYPE_FUEL } from '../../../constants';
import { ConfirmFuelSelectionRequestAction, FuelResultsAction, GameSession, PieceType } from '../../../types';
import { Event, Game } from '../../classes';
import { redirectClient, sendToThisTeam, sendUserFeedback } from '../../helpers';
import { giveNextEvent } from '../giveNextEvent';

/**
 * Client Request to transfer fuel from tankers to other aircraft. Finishes a Refuel Event
 */
export const confirmFuelSelection = async (socket: Socket, action: ConfirmFuelSelectionRequestAction) => {
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

    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socket, 'Wrong phase for refueling.');
        return;
    }

    if (!gameControllers.includes(TYPE_AIR)) {
        sendUserFeedback(socket, 'Need to be air commander.');
        return;
    }

    const thisRefuelEvent = await Event.getNext(gameId, gameTeam); // TODO: this could be an unecessary call (if we move the refuel functionality out of the event class)

    // handle the payload and stuff, send the response (with next event?) (or 2 responses...)
    const { aircraft, tankers } = action.payload;

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

    const fuelSelections: {
        pieceId: PieceType['pieceId'];
        piecePositionId: PieceType['piecePositionId'];
        newFuel: number;
    }[] = [];
    for (let x = 0; x < aircraft.length; x++) {
        // add a thing to fuelSelections (pieceInfo, as well as newFuel?)
        const thisAircraft = aircraft[x];
        const { pieceId, piecePositionId, pieceTypeId, tankerPieceId } = thisAircraft;
        if (tankerPieceId != null) {
            const newFuel = TYPE_FUEL[pieceTypeId];
            fuelSelections.push({
                pieceId,
                piecePositionId,
                newFuel
            });
        }
    }
    for (let y = 0; y < tankers.length; y++) {
        const thisTanker = tankers[y];
        const { pieceId, piecePositionId, pieceFuel, removedFuel } = thisTanker;
        if (removedFuel != null && removedFuel !== 0) {
            const newFuel = pieceFuel - removedFuel;
            fuelSelections.push({
                pieceId,
                piecePositionId,
                newFuel
            });
        }
    }

    // If there are updates to send
    if (fuelSelections.length !== 0) {
        await thisRefuelEvent.bulkUpdatePieceFuels(fuelSelections, gameTeam);

        // now give those fuel updates to the client side (nothing too visible, pieces just update)
        // don't let client assume things went well, must get things back from server to confirm

        // TODO: better payloads?
        if (fuelSelections.length > 0) {
            const serverAction: FuelResultsAction = {
                type: REFUEL_RESULTS,
                payload: {
                    fuelUpdates: fuelSelections // TODO: this should be the server's own record, not just sending back to client
                }
            };

            // sending results and no matter what, going to next event (refuel isn't multiple things, its 1 and done)
            sendToThisTeam(socket, serverAction);
        }
    }

    // TODO: would be more efficient to put the REFUEL_RESULTS into the next event action, 1 request instead of 2 (make sure to remember to include new piece positions if do things here)

    await thisRefuelEvent.delete();
    await giveNextEvent(socket, { thisGame, gameTeam }); // not putting executingStep in options to let it know not to send pieceMove
};
