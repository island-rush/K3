import { Socket } from 'socket.io';
import { ALL_AIRFIELD_LOCATIONS, TEAM_MAIN_ISLAND_STARTING_POSITIONS } from '../../../react-client/src/constants/gameboardConstants';
// prettier-ignore
import { MISSILE_TYPE_ID, PLACE_PHASE_ID, RADAR_TYPE_ID, TYPE_AIR_PIECES, TYPE_OWNERS, TYPE_TERRAIN } from '../../../react-client/src/constants/gameConstants';
import { GameSession, InvItemPlaceAction, InvItemPlaceRequestAction } from '../../../react-client/src/constants/interfaces';
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../../../react-client/src/constants/otherConstants';
import { PIECE_PLACE } from '../../../react-client/src/redux/actions/actionTypes';
import { initialGameboardEmpty } from '../../../react-client/src/redux/reducers/initialGameboardEmpty';
import { Game, InvItem } from '../../classes';
import { BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG } from '../../pages/errorTypes';
import sendUserFeedback from '../sendUserFeedback';

/**
 * User request to move piece from inventory to a position on the board.
 */
const piecePlace = async (socket: Socket, action: InvItemPlaceRequestAction) => {
    // Grab the Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    const { invItemId, selectedPosition } = action.payload;

    // Grab the Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    // Can only place pieces from inv during 'place reinforcements phase' (3)
    if (gamePhase !== PLACE_PHASE_ID) {
        sendUserFeedback(socket, 'Not the right phase...');
        return;
    }

    // Grab the InvItem
    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socket, 'Inv Item did not exist...');
        return;
    }

    const { invItemGameId, invItemTeamId, invItemTypeId } = thisInvItem;

    // Do they own this item?
    if (invItemGameId !== gameId || invItemTeamId !== gameTeam) {
        socket.emit(SOCKET_SERVER_REDIRECT, BAD_REQUEST_TAG);
        return;
    }

    // Could be multiple controller
    let atLeast1Owner = false;
    for (const gameController of gameControllers) {
        if (TYPE_OWNERS[gameController].includes(invItemTypeId)) {
            atLeast1Owner = true;
            break;
        }
    }

    if (!atLeast1Owner) {
        sendUserFeedback(socket, "Piece doesn't fall under your control");
        return;
    }

    // valid position on the board?
    if (selectedPosition < 0) {
        sendUserFeedback(socket, 'Not a valid position on the board (negative)');
        return;
    }

    // valid terrain for this piece?
    const { type } = initialGameboardEmpty[selectedPosition];
    if (!TYPE_TERRAIN[invItemTypeId].includes(type)) {
        sendUserFeedback(socket, "can't go on that terrain with this piece type");
        return;
    }

    if (!TEAM_MAIN_ISLAND_STARTING_POSITIONS[gameTeam].includes(selectedPosition) && ![RADAR_TYPE_ID, MISSILE_TYPE_ID].includes(invItemTypeId)) {
        // radar and missile only need to be placed in either silo or next to friendly piece
        sendUserFeedback(socket, 'Must place piece on/around main island.');
        return;
    }

    // TODO: could also check that they own the airfield? already check that this is on the main island...
    // TODO: does placing them in the airfield start them as 'landed' or 'airborn'? -> probably should make them landed to start....
    // TODO: does this include helicopters? they can be on land, so probably not...
    if (TYPE_AIR_PIECES.includes(invItemTypeId)) {
        if (!ALL_AIRFIELD_LOCATIONS.includes(selectedPosition)) {
            sendUserFeedback(socket, 'Must place air unit on airfield.');
            return;
        }
    }

    // TODO: need to make sure pieces are put onto main island (or surrounding waters)

    // for radars (and possibly other units)
    // need to verify that island is owned by us
    // need to verify that there is another ground unit on the hex (and no other enemy units)

    const newPiece = await thisInvItem.placeOnBoard(selectedPosition); // should also check that this piece actually got created, could return null (should return null if it failed...TODO: return null if failed...)

    // TODO: Should probably also write down how the state is stored on the frontend eventually, so others know how it works
    newPiece.pieceContents = { pieces: [] }; // new pieces have nothing in them, and piece contents is required for the frontend...

    const serverAction: InvItemPlaceAction = {
        type: PIECE_PLACE,
        payload: {
            invItemId,
            positionId: selectedPosition,
            newPiece
        }
    };

    // Send update to the client(s)
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default piecePlace;
