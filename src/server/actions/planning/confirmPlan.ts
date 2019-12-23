import { Socket } from 'socket.io';
import { distanceMatrix } from '../../../react-client/src/constants/distanceMatrix';
import { COMBAT_PHASE_ID, CONTAINER_TYPES, SLICE_PLANNING_ID, TYPE_OWNERS, TYPE_TERRAIN } from '../../../react-client/src/constants/gameConstants';
import { ConfirmPlanAction, ConfirmPlanRequestAction } from '../../../react-client/src/constants/interfaces';
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../../../react-client/src/constants/otherConstants';
import { PLAN_WAS_CONFIRMED } from '../../../react-client/src/redux/actions/actionTypes';
import { initialGameboardEmpty } from '../../../react-client/src/redux/reducers/initialGameboardEmpty';
import { Game, Piece, Plan } from '../../classes';
import { GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG } from '../../pages/errorTypes';
import sendUserFeedback from '../sendUserFeedback';
import { GameSession } from '../../../react-client/src/interfaces/sessions';

/**
 * User Request to confirm a plan for a piece.
 */
const confirmPlan = async (socket: Socket, action: ConfirmPlanRequestAction) => {
    // Grab Session
    const { gameId, gameTeam, gameControllers }: GameSession = socket.handshake.session.ir3;

    const { pieceId, plan } = action.payload;

    // Grab the Game
    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    // Must be in combat phase (2), planning slice (0) to make plans
    if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socket, 'Not the right phase/slice...looking for phase 2 slice 0');
        return;
    }

    // Does the piece exist?
    const thisPiece = await new Piece(pieceId).init();
    if (!thisPiece) {
        sendUserFeedback(socket, 'Piece did not exists...refresh page?');
        return;
    }

    const { piecePositionId, pieceTypeId, pieceGameId, pieceTeamId, pieceMoves, pieceDisabled } = thisPiece;

    // Is this piece ours? (TODO: could also check pieceType with gameControllers)
    if (pieceGameId !== gameId || pieceTeamId !== gameTeam) {
        sendUserFeedback(socket, 'Piece did not belong to your team...(or this game)');
        return;
    }

    // Could be multiple controller
    let atLeast1Owner = false;
    for (const gameController of gameControllers) {
        if (TYPE_OWNERS[gameController].includes(pieceTypeId)) {
            atLeast1Owner = true;
            break;
        }
    }

    if (!atLeast1Owner) {
        sendUserFeedback(socket, "Piece doesn't fall under your control");
        return;
    }

    if (pieceDisabled) {
        sendUserFeedback(socket, 'Piece is disabled from game effect (probably golden eye)');
        return;
    }

    const isContainer = CONTAINER_TYPES.includes(pieceTypeId);

    // Check adjacency and other parts of the plan to make sure the whole thing makes sense
    // TODO: could clean up this code a lot (once planning and containers fully done...)
    let previousPosition = piecePositionId;
    let trueMoveCount = 0;
    for (let x = 0; x < plan.length; x++) {
        // make sure adjacency between positions in the plan...
        // other checks...piece type and number of moves?

        const { type, positionId } = plan[x];

        const positionTerrain = initialGameboardEmpty[positionId].type;
        if (!TYPE_TERRAIN[pieceTypeId].includes(positionTerrain)) {
            sendUserFeedback(socket, "can't go on that terrain with this piece type");
            return;
        }

        // make sure positions are equal for container type
        // TODO: constants for this, if done this way
        if (type === 'container') {
            if (!isContainer) {
                sendUserFeedback(socket, 'sent a bad plan, container move for non-container piece...');
                return;
            }

            if (previousPosition !== positionId) {
                sendUserFeedback(socket, 'sent a bad plan, container move was not in previous position...');
                return;
            }
        } else if (type === 'move') {
            trueMoveCount++;
        }

        // This condition may have to change in the future if parts of the plan
        // don't actually move the piece
        if (distanceMatrix[previousPosition][positionId] !== 1) {
            if (type !== 'container') {
                sendUserFeedback(socket, 'sent a bad plan, positions were not adjacent...');
                return;
            }
        }

        previousPosition = positionId;
    }

    // Is the plan length less than or equal to the max moves of the piece?
    // TODO: should use the moves from the database for the piece instead of the type_moves, because could be getting a boost
    if (trueMoveCount > pieceMoves) {
        sendUserFeedback(socket, 'sent a bad plan, piece was moved more than its range...');
        return;
    }

    // prepare the bulk insert
    const plansToInsert = [];
    for (let movementOrder = 0; movementOrder < plan.length; movementOrder++) {
        const { positionId, type } = plan[movementOrder];
        const specialFlag = type === 'move' ? 0 : 1; // 1 = container, use other numbers for future special flags...
        plansToInsert.push([pieceGameId, pieceTeamId, pieceId, movementOrder, positionId, specialFlag]);
    }

    // bulk insert (always insert bulk, don't really ever insert single stuff, since a 'plan' is a collection of moves, but the table is 'Plans')
    // TODO: could change the phrasing on Plan vs Moves (as far as inserting..function names...database entries??)
    await Plan.insert(plansToInsert);

    const serverAction: ConfirmPlanAction = {
        type: PLAN_WAS_CONFIRMED,
        payload: {
            pieceId,
            plan
        }
    };

    // Send the update to the client(s)
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

export default confirmPlan;
