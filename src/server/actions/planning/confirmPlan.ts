// prettier-ignore
import { COMBAT_PHASE_ID, distanceMatrix, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, initialGameboardEmpty, PLAN_WAS_CONFIRMED, SLICE_PLANNING_ID, TYPE_OWNERS, TYPE_TERRAIN, NOT_WAITING_STATUS } from '../../../constants';
import { ConfirmPlanAction, ConfirmPlanRequestAction, SocketSession } from '../../../types';
import { Game, Piece, Plan } from '../../classes';
import { redirectClient, sendToTeam, sendUserFeedback } from '../../helpers';

/**
 * User Request to confirm a plan for a piece.
 */
export const confirmPlan = async (session: SocketSession, action: ConfirmPlanRequestAction) => {
    // Grab Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    const { pieceId, plan } = action.payload;

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

    // Must be in combat phase (2), planning slice (0) to make plans
    if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socketId, 'Not the right phase/slice...looking for phase 2 slice 0');
        return;
    }

    // already confirmed done
    if (thisGame.getStatus(gameTeam) !== NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'You already confirmed you were done. Stop sending plans and stuff.');
        return;
    }

    // Does the piece exist?
    const thisPiece = await new Piece(pieceId).init();
    if (!thisPiece) {
        sendUserFeedback(socketId, 'Piece did not exists...refresh page?');
        return;
    }

    const { piecePositionId, pieceTypeId, pieceGameId, pieceTeamId, pieceMoves, isPieceDisabled } = thisPiece;

    // Is this piece ours? (TODO: could also check pieceType with gameControllers)
    if (pieceGameId !== gameId || pieceTeamId !== gameTeam) {
        sendUserFeedback(socketId, 'Piece did not belong to your team...(or this game)');
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
        sendUserFeedback(socketId, "Piece doesn't fall under your control");
        return;
    }

    if (isPieceDisabled) {
        sendUserFeedback(socketId, 'Piece is disabled from game effect (probably golden eye)');
        return;
    }

    // Check adjacency and other parts of the plan to make sure the whole thing makes sense
    let previousPosition = piecePositionId;
    let trueMoveCount = 0;
    for (let x = 0; x < plan.length; x++) {
        const positionId = plan[x];

        const positionTerrain = initialGameboardEmpty[positionId].type;

        if (!TYPE_TERRAIN[pieceTypeId].includes(positionTerrain)) {
            sendUserFeedback(socketId, "can't go on that terrain with this piece type");
            return;
        }

        trueMoveCount++;

        if (distanceMatrix[previousPosition][positionId] !== 1) {
            sendUserFeedback(socketId, 'sent a bad plan, positions were not adjacent...');
            return;
        }

        previousPosition = positionId;
    }

    // Is the plan length less than or equal to the max moves of the piece?
    if (trueMoveCount > pieceMoves) {
        sendUserFeedback(socketId, 'sent a bad plan, piece was moved more than its range...');
        return;
    }

    // prepare the bulk insert
    const plansToInsert = [];
    for (let movementOrder = 0; movementOrder < plan.length; movementOrder++) {
        const positionId = plan[movementOrder];
        plansToInsert.push([pieceGameId, pieceTeamId, pieceId, movementOrder, positionId]);
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
    sendToTeam(gameId, gameTeam, serverAction);
};
