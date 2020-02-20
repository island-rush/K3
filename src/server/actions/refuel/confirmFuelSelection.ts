// prettier-ignore
import { COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, TYPE_AIR, TYPE_FUEL } from '../../../constants';
import { ConfirmFuelSelectionRequestAction, FuelResultsAction, PieceType, REFUEL_RESULTS, SocketSession } from '../../../types';
import { Capability, Game } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

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

    // handle the payload and stuff, send the response (with next event?) (or 2 responses...)
    const { aircraft, tankers } = action.payload;

    // TODO: go through fuelSelections and make sure it makes sense from backend (security)
    // ex: these pieces exist, these fuel amounts aren't beyond tanker fuel (can't drain tanker, or add fuel from nothing)
    // basically make sure no cheating...
    // but right now we'll assume its all good (to get it working...)
    // need to check each of the pieces? (we own them...they have the fuel we think they are giving...stuff like that)

    // TODO: ideally would re-grab all the values from the database (like to check types and things...and pieceFuel)

    const fuelSelections: {
        pieceId: PieceType['pieceId'];
        piecePositionId: PieceType['piecePositionId'];
        newFuel: PieceType['pieceFuel'];
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
        await Capability.bulkUpdatePieceFuels(fuelSelections, gameId, gameTeam);

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
            sendToTeam(gameId, gameTeam, serverAction);
        }
    } else {
        sendUserFeedback(socketId, 'nothing changed');
    }
};
