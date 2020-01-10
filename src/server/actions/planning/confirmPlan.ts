import { Socket } from 'socket.io';
// prettier-ignore
import { COMBAT_PHASE_ID, distanceMatrix, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, initialGameboardEmpty, PLAN_WAS_CONFIRMED, SLICE_PLANNING_ID, TYPE_OWNERS, TYPE_TERRAIN } from '../../../constants';
import { ConfirmPlanAction, ConfirmPlanRequestAction, GameSession } from '../../../types';
import { Game, Piece, Plan } from '../../classes';
import { redirectClient, sendToThisTeam, sendUserFeedback } from '../../helpers';

/**
 * User Request to confirm a plan for a piece.
 */
export const confirmPlan = async (socket: Socket, action: ConfirmPlanRequestAction) => {
    // Grab Session
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3 as GameSession;

    const { pieceId, plan } = action.payload;

    // Grab the Game
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        redirectClient(socket, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        redirectClient(socket, GAME_INACTIVE_TAG);
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

    // Check adjacency and other parts of the plan to make sure the whole thing makes sense
    let previousPosition = piecePositionId;
    let trueMoveCount = 0;
    for (let x = 0; x < plan.length; x++) {
        const { positionId } = plan[x];

        const positionTerrain = initialGameboardEmpty[positionId].type;

        if (!TYPE_TERRAIN[pieceTypeId].includes(positionTerrain)) {
            sendUserFeedback(socket, "can't go on that terrain with this piece type");
            return;
        }

        trueMoveCount++;

        if (distanceMatrix[previousPosition][positionId] !== 1) {
            sendUserFeedback(socket, 'sent a bad plan, positions were not adjacent...');
            return;
        }

        previousPosition = positionId;
    }

    // Is the plan length less than or equal to the max moves of the piece?
    if (trueMoveCount > pieceMoves) {
        sendUserFeedback(socket, 'sent a bad plan, piece was moved more than its range...');
        return;
    }

    // prepare the bulk insert
    const plansToInsert = [];
    for (let movementOrder = 0; movementOrder < plan.length; movementOrder++) {
        const { positionId } = plan[movementOrder];
        const specialFlag = 0; // 0 = normal movement, use other numbers for future move types...
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
    sendToThisTeam(socket, serverAction);
};
