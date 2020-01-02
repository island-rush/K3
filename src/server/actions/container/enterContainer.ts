import { Socket } from 'socket.io';
// prettier-ignore
import { AIRFIELD_TYPE, ARMY_INFANTRY_COMPANY_TYPE_ID, ARTILLERY_BATTERY_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID, A_C_CARRIER_TYPE_ID, COMBAT_PHASE_ID, C_130_TYPE_ID, distanceMatrix, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, initialGameboardEmpty, LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, OUTER_PIECE_CLICK_ACTION, SAM_SITE_TYPE_ID, SLICE_PLANNING_ID, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION, SOF_TEAM_TYPE_ID, STEALTH_FIGHTER_TYPE_ID, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, TANK_COMPANY_TYPE_ID, TRANSPORT_TYPE_ID, TYPE_MAIN } from '../../../constants';
import { EnterContainerAction, EnterContainerRequestAction, GameSession, PieceType } from '../../../types';
import { Game, Piece } from '../../classes';
import { sendUserFeedback } from '../sendUserFeedback';

/**
 * User request to put one piece inside of another.
 */
export const enterContainer = async (socket: Socket, action: EnterContainerRequestAction) => {
    // Grab the Session
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3 as GameSession;

    const { selectedPiece, containerPiece } = action.payload;

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

    // TODO: rename TYPE_MAIN into COCOM_TYPE_ID probably, that way rulebook is more reflected in the code...
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, 'Not the right controller type for this action...');
        return;
    }

    if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
        sendUserFeedback(socket, 'Not the right phase/slice for container entering.');
        return;
    }

    // Grab the Pieces
    const thisSelectedPiece = await new Piece(selectedPiece.pieceId).init();
    if (!thisSelectedPiece) {
        sendUserFeedback(socket, 'Selected Piece did not exists...refresh page probably');
        return;
    }

    const thisContainerPiece = await new Piece(containerPiece.pieceId).init();
    if (!thisContainerPiece) {
        sendUserFeedback(socket, 'Selected Container piece did not exist...refresh page please.');
        return;
    }

    const piecesInside: any = await thisContainerPiece.getPiecesInside();

    const countOf: any = {}; // number of each item type already inside it
    piecesInside.forEach((piece: PieceType) => {
        countOf[piece.pieceTypeId] = (countOf[piece.pieceTypeId] || 0) + 1;
    });

    switch (thisContainerPiece.pieceTypeId) {
        case TACTICAL_AIRLIFT_SQUADRON_TYPE_ID:
            // TacticalAirLift = 1 marine infantry OR 1 army infantry
            // also need to make sure we are on an airfield spot
            // TODO: make sure we are 'landed' (same as the C130...)

            if (thisContainerPiece.piecePositionId !== thisSelectedPiece.piecePositionId) {
                sendUserFeedback(socket, 'Selected piece must be in same hex for tactial airlift.');
                return;
            }

            if (initialGameboardEmpty[thisContainerPiece.piecePositionId].type !== AIRFIELD_TYPE) {
                sendUserFeedback(socket, 'Must be on an airfield spot to transfer troops into tactical airlift.');
                return;
            }

            switch (thisSelectedPiece.pieceTypeId) {
                case ARMY_INFANTRY_COMPANY_TYPE_ID:
                case MARINE_INFANTRY_COMPANY_TYPE_ID:
                    if ((countOf[ARMY_INFANTRY_COMPANY_TYPE_ID] || 0) === 1 || (countOf[MARINE_INFANTRY_COMPANY_TYPE_ID] || 0) === 1) {
                        sendUserFeedback(socket, 'Tactical airlift is already full.');
                        return;
                    }
                    break;
                default:
                    sendUserFeedback(socket, 'Piece type is not allowed within tactical airlift piece.');
                    return;
            }
            break;
        case TRANSPORT_TYPE_ID:
            // Transport = "max of 3 infantry, or 2 infantry and 1 vehicle unit (tank, convoy, artillery, SAM, or helicopter)"
            if (distanceMatrix[thisContainerPiece.piecePositionId][thisSelectedPiece.piecePositionId] !== 1) {
                sendUserFeedback(socket, 'Selected piece must be 1 hex away from transport piece to enter it.');
                return;
            }

            const totalPeople = (countOf[MARINE_INFANTRY_COMPANY_TYPE_ID] || 0) + (countOf[ARMY_INFANTRY_COMPANY_TYPE_ID] || 0);
            const totalVehicles =
                (countOf[TANK_COMPANY_TYPE_ID] || 0) +
                (countOf[LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID] || 0) +
                (countOf[ARTILLERY_BATTERY_TYPE_ID] || 0) +
                (countOf[SAM_SITE_TYPE_ID] || 0) +
                (countOf[ATTACK_HELICOPTER_TYPE_ID] || 0);

            switch (thisSelectedPiece.pieceTypeId) {
                case MARINE_INFANTRY_COMPANY_TYPE_ID:
                case ARMY_INFANTRY_COMPANY_TYPE_ID:
                    if (totalPeople === 3 || (totalPeople === 2 && totalVehicles === 1)) {
                        sendUserFeedback(socket, "Can't put another person, would exceed allowed combinations for transport.");
                        return;
                    }
                    break;
                case TANK_COMPANY_TYPE_ID:
                case LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID:
                case ARTILLERY_BATTERY_TYPE_ID:
                case SAM_SITE_TYPE_ID:
                case ATTACK_HELICOPTER_TYPE_ID:
                    if (totalPeople === 3 || totalVehicles === 1) {
                        sendUserFeedback(socket, "Can't put another vehicle, would exceed allowed combos.");
                        return;
                    }
                    break;
                default:
                    sendUserFeedback(socket, 'Piece type is not allowed within transport piece.');
                    return;
            }
            break;
        case C_130_TYPE_ID:
            // C130 = 1 SOF team
            // TODO: make sure the c-130 is 'landed' and on an airfield position... (distinction between airborn and landed probably)

            if (thisContainerPiece.piecePositionId !== thisSelectedPiece.piecePositionId) {
                sendUserFeedback(socket, 'Selected piece must be in same hex for c130.');
                return;
            }

            if (initialGameboardEmpty[thisContainerPiece.piecePositionId].type !== AIRFIELD_TYPE) {
                sendUserFeedback(socket, 'Must enter from within an airfield.');
                return;
            }

            switch (thisSelectedPiece.pieceTypeId) {
                case SOF_TEAM_TYPE_ID:
                    if ((countOf[SOF_TEAM_TYPE_ID] || 0) !== 0) {
                        sendUserFeedback(socket, 'Already has SOF team inside it.');
                        return;
                    }
                    break;
                default:
                    sendUserFeedback(socket, 'Piece type is not allowed within c130.');
                    return;
            }
            break;
        case A_C_CARRIER_TYPE_ID:
            // Carrier = max capacity: 3 fighters, or 2 fighters and 1 c130, or 1 fighter and 2 c130s, but never 3 c130s, 2 helicopter at any given time...
            // TODO: could create constants for the list of allowed pieces

            if (thisContainerPiece.piecePositionId !== thisSelectedPiece.piecePositionId) {
                sendUserFeedback(socket, 'Selected piece must be in same hex for carrier.');
                return;
            }

            switch (thisSelectedPiece.pieceTypeId) {
                case C_130_TYPE_ID:
                case STEALTH_FIGHTER_TYPE_ID:
                    if (
                        countOf[STEALTH_FIGHTER_TYPE_ID] === 3 ||
                        (countOf[STEALTH_FIGHTER_TYPE_ID] === 2 && countOf[C_130_TYPE_ID] === 1) ||
                        (countOf[STEALTH_FIGHTER_TYPE_ID] === 1 && countOf[C_130_TYPE_ID] === 2)
                    ) {
                        sendUserFeedback(socket, "Can't add another fighter/c130, allowed combinations would be exceeded.");
                        return;
                    }
                    break;
                case ATTACK_HELICOPTER_TYPE_ID:
                    if (countOf[ATTACK_HELICOPTER_TYPE_ID] === 2) {
                        sendUserFeedback(socket, "Can't add another helicopter, only allowed 2 max. Already have 2.");
                        return;
                    }
                    break;
                default:
                    sendUserFeedback(socket, 'That piece type is not allowed within carriers.');
                    return;
            }
            break;
        default:
            sendUserFeedback(socket, 'This piece is not a valid container.');
            return;
    }

    await Piece.putInsideContainer(thisSelectedPiece, thisContainerPiece);

    const serverAction: EnterContainerAction = {
        type: OUTER_PIECE_CLICK_ACTION,
        payload: {
            gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
            selectedPiece: thisSelectedPiece,
            containerPiece: thisContainerPiece
        }
    };

    // Send the update to the client(s)
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};
