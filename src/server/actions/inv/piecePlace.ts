// prettier-ignore
import { ALL_AIRFIELD_LOCATIONS, BAD_REQUEST_TAG, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, initialGameboardEmpty, ISLAND_POSITIONS, MISSILE_TYPE_ID, PIECE_PLACE, PLACE_PHASE_ID, RADAR_TYPE_ID, TEAM_MAIN_ISLAND_STARTING_POSITIONS, TYPE_AIR_PIECES, TYPE_OWNERS, TYPE_TERRAIN, DRAGON_ISLAND_ID, HR_REPUBLIC_ISLAND_ID, MONTAVILLE_ISLAND_ID, LION_ISLAND_ID, NOYARC_ISLAND_ID, FULLER_ISLAND_ID, RICO_ISLAND_ID, TAMU_ISLAND_ID, SHOR_ISLAND_ID, KEONI_ISLAND_ID, EAGLE_ISLAND_ID } from '../../../constants';
import { InvItemPlaceAction, InvItemPlaceRequestAction, SocketSession } from '../../../types';
import { Game, InvItem, Piece } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User request to move piece from inventory to a position on the board.
 */
export const piecePlace = async (session: SocketSession, action: InvItemPlaceRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    const { invItemId, selectedPosition } = action.payload;

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

    // Can only place pieces from inv during 'place reinforcements phase' (3)
    if (gamePhase !== PLACE_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase...');
        return;
    }

    // Grab the InvItem
    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socketId, 'Inv Item did not exist...');
        return;
    }

    const { invItemGameId, invItemTeamId, invItemTypeId } = thisInvItem;

    // Do they own this item?
    if (invItemGameId !== gameId || invItemTeamId !== gameTeam) {
        redirectClient(socketId, BAD_REQUEST_TAG);
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
        sendUserFeedback(socketId, "Piece doesn't fall under your control");
        return;
    }

    // valid position on the board?
    if (selectedPosition < 0) {
        sendUserFeedback(socketId, 'Not a valid position on the board (negative)');
        return;
    }

    // valid terrain for this piece?
    const { type } = initialGameboardEmpty[selectedPosition];
    if (!TYPE_TERRAIN[invItemTypeId].includes(type)) {
        sendUserFeedback(socketId, "can't go on that terrain with this piece type");
        return;
    }

    if (!TEAM_MAIN_ISLAND_STARTING_POSITIONS[gameTeam].includes(selectedPosition) && ![RADAR_TYPE_ID, MISSILE_TYPE_ID].includes(invItemTypeId)) {
        // radar and missile only need to be placed in either silo or next to friendly piece
        sendUserFeedback(socketId, 'Must place piece on/around main island.');
        return;
    }

    // TODO: could also check that they own the airfield? already check that this is on the main island...
    if (TYPE_AIR_PIECES.includes(invItemTypeId)) {
        if (!ALL_AIRFIELD_LOCATIONS.includes(selectedPosition)) {
            sendUserFeedback(socketId, 'Must place air unit on airfield.');
            return;
        }
    }

    if (invItemTypeId === RADAR_TYPE_ID) {
        // at least 1 ground and no enemies there
        const ableToPlaceRadar = await Piece.ableToPlaceRadar(gameId, gameTeam, selectedPosition);
        if (!ableToPlaceRadar) {
            sendUserFeedback(socketId, 'Radar must be placed next to ground unit with no enemies.');
            return;
        }

        let completelyOwnsIsland = false;
        let islandNum = -1;

        const allKeys = Object.keys(ISLAND_POSITIONS);
        for (let x = 0; x < allKeys.length; x++) {
            const currentKey = parseInt(allKeys[x]);
            const thisIslandPositions = ISLAND_POSITIONS[currentKey];
            if (thisIslandPositions.includes(selectedPosition)) {
                islandNum = currentKey;
                break;
            }
        }

        // probably better way of doing this, but double flag main islands make it a pain
        switch (islandNum) {
            case DRAGON_ISLAND_ID:
                if (thisGame.flag0 === gameTeam && thisGame.flag1 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case HR_REPUBLIC_ISLAND_ID:
                if (thisGame.flag2 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case MONTAVILLE_ISLAND_ID:
                if (thisGame.flag3 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case LION_ISLAND_ID:
                if (thisGame.flag4 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case NOYARC_ISLAND_ID:
                if (thisGame.flag5 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case FULLER_ISLAND_ID:
                if (thisGame.flag6 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case RICO_ISLAND_ID:
                if (thisGame.flag7 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case TAMU_ISLAND_ID:
                if (thisGame.flag8 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case SHOR_ISLAND_ID:
                if (thisGame.flag9 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case KEONI_ISLAND_ID:
                if (thisGame.flag10 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            case EAGLE_ISLAND_ID:
                if (thisGame.flag11 === gameTeam && thisGame.flag12 === gameTeam) {
                    completelyOwnsIsland = true;
                }
                break;
            default:
                sendUserFeedback(socketId, 'Was not on a known island position.');
                return;
        }

        if (!completelyOwnsIsland) {
            sendUserFeedback(socketId, 'Radar must be on completely owned island.');
            return;
        }
    }

    const newPiece = await thisInvItem.placeOnBoard(selectedPosition); // should also check that this piece actually got created, could return null (should return null if it failed...TODO: return null if failed...)

    // TODO: should enforce these within a frontend type
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
    sendToTeam(gameId, gameTeam, serverAction);
};
