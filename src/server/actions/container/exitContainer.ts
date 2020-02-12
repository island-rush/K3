// prettier-ignore
import { COMBAT_PHASE_ID, CONTAINER_TYPES, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, initialGameboardEmpty, INNER_PIECE_CLICK_ACTION, SLICE_PLANNING_ID, TYPE_OWNERS, TYPE_TERRAIN, NOT_WAITING_STATUS, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, AIRFIELD_TYPE, ALL_AIRFIELD_LOCATIONS } from '../../../constants';
import { ExitContainerAction, ExitContainerRequestAction, SocketSession } from '../../../types';
import { Game, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to move piece outside of a container to the same position.
 */
export const exitContainer = async (session: SocketSession, action: ExitContainerRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    const { selectedPiece, containerPiece } = action.payload;

    // Grab the Game
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        redirectClient(socketId, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        redirectClient(socketId, GAME_INACTIVE_TAG);
        return;
    }

    if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right phase/slice for container entering.');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    // Grab the Pieces
    const thisSelectedPiece = await new Piece(selectedPiece.pieceId).init();
    if (!thisSelectedPiece) {
        sendUserFeedback(socketId, 'Selected Piece did not exists...refresh page probably');
        return;
    }

    // Controller must own the piece
    let atLeast1Owner = false;
    for (const gameController of gameControllers) {
        if (TYPE_OWNERS[gameController].includes(thisSelectedPiece.pieceTypeId)) {
            atLeast1Owner = true;
            break;
        }
    }

    if (!atLeast1Owner) {
        sendUserFeedback(socketId, "Piece doesn't fall under your control");
        return;
    }

    const thisContainerPiece = await new Piece(containerPiece.pieceId).init();
    if (!thisContainerPiece) {
        sendUserFeedback(socketId, 'Selected Container piece did not exist...');
        return;
    }

    if (!CONTAINER_TYPES.includes(thisContainerPiece.pieceTypeId)) {
        sendUserFeedback(socketId, 'Selected Container piece was not a container type');
        return;
    }

    // TODO: can't 'air drop', other edge cases and stuff
    // TODO: could combine with exitTransport container and do more switch case for edge cases / terrain checking?

    if (!TYPE_TERRAIN[thisSelectedPiece.pieceTypeId].includes(initialGameboardEmpty[thisSelectedPiece.piecePositionId].type)) {
        sendUserFeedback(socketId, "that piece can't be on that terrain.");
        return;
    }

    // Air Transport is not allowed to 'air drop', can only drop off and enter from a controlled airfield
    if (thisContainerPiece.pieceTypeId === TACTICAL_AIRLIFT_SQUADRON_TYPE_ID) {
        // must be on an airfield
        // TODO: can likely assume these are true, since already inside the container (getting redundant from enterContainer)
        if (thisContainerPiece.piecePositionId !== thisSelectedPiece.piecePositionId) {
            sendUserFeedback(socketId, 'Selected piece must be in same hex for tactial airlift.');
            return;
        }

        if (initialGameboardEmpty[thisContainerPiece.piecePositionId].type !== AIRFIELD_TYPE) {
            sendUserFeedback(socketId, 'Must be on an airfield spot to transfer troops out of tactical airlift.');
            return;
        }

        const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(thisContainerPiece.piecePositionId);
        const airfieldOwner = thisGame.getAirfield(airfieldNum);
        if (gameTeam !== airfieldOwner) {
            sendUserFeedback(socketId, 'must own the airfield to land the aircraft and board things into it or out.');
            return;
        }
    }

    await Piece.putOutsideContainer(thisSelectedPiece.pieceId, thisSelectedPiece.piecePositionId);

    const serverAction: ExitContainerAction = {
        type: INNER_PIECE_CLICK_ACTION,
        payload: {
            gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
            selectedPiece,
            containerPiece
        }
    };

    // Send the update to the client(s)
    sendToTeam(gameId, gameTeam, serverAction);
};
