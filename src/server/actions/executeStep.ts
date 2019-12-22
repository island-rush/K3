import { Socket } from 'socket.io';
import { BLUE_TEAM_ID, PLACE_PHASE_ID, RED_TEAM_ID, WAITING_STATUS } from '../../react-client/src/constants/gameConstants';
import { GameSession, NewRoundAction, PlacePhaseAction, UpdateFlagAction } from '../../react-client/src/constants/interfaces';
import { SOCKET_SERVER_SENDING_ACTION } from '../../react-client/src/constants/otherConstants';
import { NEW_ROUND, PLACE_PHASE, UPDATE_FLAGS } from '../../react-client/src/redux/actions/actionTypes';
import { Capability, Event, Game, Piece, Plan } from '../classes';
import { BOTH_TEAMS_INDICATOR, COL_BATTLE_EVENT_TYPE, POS_BATTLE_EVENT_TYPE, REFUEL_EVENT_TYPE } from './eventConstants';
import giveNextEvent from './giveNextEvent';

/**
 * Move pieces / step through plans
 */
const executeStep = async (socket: Socket, thisGame: Game) => {
    // Grab Session (already verified from last function)
    const session: GameSession = socket.handshake.session.ir3;

    // inserting events here and moving pieces, or changing to new round or something...
    const { gameId, gameRound } = thisGame;

    // TODO: rename this to 'hadPlans0' or something more descriptive
    const currentMovementOrder0 = await Plan.getCurrentMovementOrder(gameId, BLUE_TEAM_ID);
    const currentMovementOrder1 = await Plan.getCurrentMovementOrder(gameId, RED_TEAM_ID);

    // No More Plans for either team -> end of the round
    // DOESN'T MAKE PLANS FOR PIECES STILL IN THE SAME POSITION...NEED TO HAVE AT LEAST 1 PLAN FOR ANYTHING TO HAPPEN (pieces in same postion would battle (again?) if there was 1 plan elsewhere...)
    if (currentMovementOrder0 == null && currentMovementOrder1 == null) {
        await thisGame.setSlice(0); // if no more moves, end of slice 1

        await Piece.resetMoves(gameId); // TODO: could move this functionality to Game (no need to pass in the gameId)

        // Decrease game effects that last for x rounds
        await Capability.decreaseRemoteSensing(gameId);
        await Capability.decreaseBiologicalWeapons(gameId);
        await Capability.decreaseGoldenEye(gameId);
        await Capability.decreaseCommInterrupt(gameId);
        await Capability.decreaseRaiseMorale(gameId);

        // TODO: could do constant with 'ROUNDS_PER_COMBAT' although getting excessive
        if (gameRound === 2) {
            // Combat -> Place Phase
            await thisGame.setRound(0);
            await thisGame.setPhase(PLACE_PHASE_ID);

            const placePhaseAction0: PlacePhaseAction = {
                type: PLACE_PHASE,
                payload: {
                    gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
                    confirmedRemoteSense: await Capability.getRemoteSensing(gameId, BLUE_TEAM_ID),
                    confirmedBioWeapons: await Capability.getBiologicalWeapons(gameId, BLUE_TEAM_ID),
                    confirmedRaiseMorale: await Capability.getRaiseMorale(gameId, BLUE_TEAM_ID),
                    confirmedCommInterrupt: await Capability.getCommInterrupt(gameId, BLUE_TEAM_ID),
                    confirmedGoldenEye: await Capability.getGoldenEye(gameId, BLUE_TEAM_ID)
                }
            };
            const placePhaseAction1: PlacePhaseAction = {
                type: PLACE_PHASE,
                payload: {
                    gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
                    confirmedRemoteSense: await Capability.getRemoteSensing(gameId, RED_TEAM_ID),
                    confirmedBioWeapons: await Capability.getBiologicalWeapons(gameId, RED_TEAM_ID),
                    confirmedRaiseMorale: await Capability.getRaiseMorale(gameId, RED_TEAM_ID),
                    confirmedCommInterrupt: await Capability.getCommInterrupt(gameId, RED_TEAM_ID),
                    confirmedGoldenEye: await Capability.getGoldenEye(gameId, RED_TEAM_ID)
                }
            };

            socket.to(`game${gameId}team0`).emit(SOCKET_SERVER_SENDING_ACTION, placePhaseAction0);
            socket.to(`game${gameId}team1`).emit(SOCKET_SERVER_SENDING_ACTION, placePhaseAction1);

            const thisSocketsAction = session.gameTeam === BLUE_TEAM_ID ? placePhaseAction0 : placePhaseAction1;
            socket.emit(SOCKET_SERVER_SENDING_ACTION, thisSocketsAction);
            return;
        }
        // Next Round of Combat
        await thisGame.setRound(gameRound + 1);

        const newRoundAction0: NewRoundAction = {
            type: NEW_ROUND,
            payload: {
                gameRound: thisGame.gameRound,
                gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
                confirmedRemoteSense: await Capability.getRemoteSensing(gameId, BLUE_TEAM_ID),
                confirmedBioWeapons: await Capability.getBiologicalWeapons(gameId, BLUE_TEAM_ID),
                confirmedRaiseMorale: await Capability.getRaiseMorale(gameId, BLUE_TEAM_ID),
                confirmedCommInterrupt: await Capability.getCommInterrupt(gameId, BLUE_TEAM_ID),
                confirmedGoldenEye: await Capability.getGoldenEye(gameId, BLUE_TEAM_ID)
            }
        };
        const newRoundAction1: NewRoundAction = {
            type: NEW_ROUND,
            payload: {
                gameRound: thisGame.gameRound,
                gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
                confirmedRemoteSense: await Capability.getRemoteSensing(gameId, RED_TEAM_ID),
                confirmedBioWeapons: await Capability.getBiologicalWeapons(gameId, RED_TEAM_ID),
                confirmedRaiseMorale: await Capability.getRaiseMorale(gameId, RED_TEAM_ID),
                confirmedCommInterrupt: await Capability.getCommInterrupt(gameId, RED_TEAM_ID),
                confirmedGoldenEye: await Capability.getGoldenEye(gameId, RED_TEAM_ID)
            }
        };

        socket.to(`game${gameId}team0`).emit(SOCKET_SERVER_SENDING_ACTION, newRoundAction0);
        socket.to(`game${gameId}team1`).emit(SOCKET_SERVER_SENDING_ACTION, newRoundAction1);

        const thisSocketsAction = session.gameTeam === BLUE_TEAM_ID ? newRoundAction0 : newRoundAction1;
        socket.emit(SOCKET_SERVER_SENDING_ACTION, thisSocketsAction);
        return;
    }

    // One of the teams may be without plans, keep them waiting
    if (currentMovementOrder0 == null) {
        await thisGame.setStatus(BLUE_TEAM_ID, WAITING_STATUS);
    }
    if (currentMovementOrder1 == null) {
        await thisGame.setStatus(RED_TEAM_ID, WAITING_STATUS);
    }

    const currentMovementOrder: number = currentMovementOrder0 != null ? currentMovementOrder0 : currentMovementOrder1;

    // Collision Battle Events
    const allCollisions: any = await Plan.getCollisions(gameId, currentMovementOrder); // each item in collisionBattles has {pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, planPositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1, planPositionId1 }
    if (allCollisions.length > 0) {
        const allCollideEvents: any = {}; // 'position0-position1' => [piecesInvolved]

        for (let x = 0; x < allCollisions.length; x++) {
            const { pieceId0, piecePositionId0, planPositionId0, pieceId1 } = allCollisions[x];

            // TODO: figure out if these 2 pieces would actually collide / battle (do the same for position battles)
            // consider visibility

            const thisEventPositions = `${piecePositionId0}-${planPositionId0}`;
            if (!Object.keys(allCollideEvents).includes(thisEventPositions)) allCollideEvents[thisEventPositions] = [];
            if (!allCollideEvents[thisEventPositions].includes(pieceId0)) allCollideEvents[thisEventPositions].push(pieceId0);
            if (!allCollideEvents[thisEventPositions].includes(pieceId1)) allCollideEvents[thisEventPositions].push(pieceId1);
        }

        const eventInserts = [];
        const eventItemInserts = [];
        const keys = Object.keys(allCollideEvents);
        for (let b = 0; b < keys.length; b++) {
            const key = keys[b];
            eventInserts.push([gameId, BOTH_TEAMS_INDICATOR, COL_BATTLE_EVENT_TYPE, key.split('-')[0], key.split('-')[1]]);
            const eventPieces = allCollideEvents[key];
            for (let x = 0; x < eventPieces.length; x++) eventItemInserts.push([eventPieces[x], gameId, key.split('-')[0], key.split('-')[1]]);
        }

        await Event.bulkInsertEvents(eventInserts);
        await Event.bulkInsertItems(gameId, eventItemInserts);
    }

    await Piece.move(gameId, currentMovementOrder); // changes the piecePositionId, deletes the plan, all for specialflag = 0
    await Piece.updateVisibilities(gameId);

    const didUpdateFlags = await thisGame.updateFlags();
    if (didUpdateFlags) {
        const updateFlagAction: UpdateFlagAction = {
            type: UPDATE_FLAGS,
            payload: {
                flag0: thisGame.flag0,
                flag1: thisGame.flag1,
                flag2: thisGame.flag2,
                flag3: thisGame.flag3,
                flag4: thisGame.flag4,
                flag5: thisGame.flag5,
                flag6: thisGame.flag6,
                flag7: thisGame.flag7,
                flag8: thisGame.flag8,
                flag9: thisGame.flag9,
                flag10: thisGame.flag10,
                flag11: thisGame.flag11,
                flag12: thisGame.flag12
            }
        };

        // Send all flag updates to every team
        socket.to(`game${gameId}`).emit(SOCKET_SERVER_SENDING_ACTION, updateFlagAction);
        socket.emit(SOCKET_SERVER_SENDING_ACTION, updateFlagAction);
    }

    // Position Battle Events
    const allPositionCombinations: any = await Plan.getPositionCombinations(gameId);
    if (allPositionCombinations.length > 0) {
        const allPosEvents: any = {};
        for (let x = 0; x < allPositionCombinations.length; x++) {
            const { pieceId0, piecePositionId0, pieceId1 } = allPositionCombinations[x];

            // consider if they would fight (see collision)
            // consider visibility

            const thisEventPosition = `${piecePositionId0}`;
            if (!Object.keys(allPosEvents).includes(thisEventPosition)) allPosEvents[thisEventPosition] = [];
            if (!allPosEvents[thisEventPosition].includes(pieceId0)) allPosEvents[thisEventPosition].push(pieceId0);
            if (!allPosEvents[thisEventPosition].includes(pieceId1)) allPosEvents[thisEventPosition].push(pieceId1);
        }

        const eventInserts = [];
        const eventItemInserts = [];
        const keys = Object.keys(allPosEvents);
        for (let b = 0; b < keys.length; b++) {
            const key = keys[b];
            eventInserts.push([gameId, BOTH_TEAMS_INDICATOR, POS_BATTLE_EVENT_TYPE, key, key]);
            const eventPieces = allPosEvents[key];
            for (let x = 0; x < eventPieces.length; x++) eventItemInserts.push([eventPieces[x], gameId, key, key]);
        }

        await Event.bulkInsertEvents(eventInserts);
        await Event.bulkInsertItems(gameId, eventItemInserts);
    }

    // should not do refuel events if the team didn't have any plans for this step (TODO: prevent refuel stuff for team specific things)

    // refueling is team specific (loop through 0 and 1 teamIds)
    // TODO: could refactor this to be cleaner (easier to read)
    const teamHadPlans = [currentMovementOrder0 == null ? 0 : 1, currentMovementOrder1 == null ? 0 : 1];
    for (let thisTeamNum = 0; thisTeamNum < 2; thisTeamNum++) {
        if (teamHadPlans[thisTeamNum]) {
            // refuel events if they had plans for this step, otherwise don't want to refuel stuff for no plans (possibly will do it anyway)
            // need to grab all refuel events from database, looking at pieces in the same positions
            const allPositionRefuels: any = await Piece.getPositionRefuels(gameId, thisTeamNum);
            if (allPositionRefuels.length > 0) {
                const allPosEvents: any = {};
                for (let x = 0; x < allPositionRefuels.length; x++) {
                    // tnkrPieceId, tnkrPieceTypeId, tnkrPiecePositionId, tnkrPieceMoves, tnkrPieceFuel, arcftPieceId, arcftPieceTypeId, arcftPiecePositionId, arcftPieceMoves, arcftPieceFuel
                    // prettier-ignore
                    const { tnkrPieceId, tnkrPiecePositionId, arcftPieceId } = allPositionRefuels[x];

                    const thisEventPosition = `${tnkrPiecePositionId}`;
                    if (!Object.keys(allPosEvents).includes(thisEventPosition)) allPosEvents[thisEventPosition] = [];
                    if (!allPosEvents[thisEventPosition].includes(tnkrPieceId)) allPosEvents[thisEventPosition].push(tnkrPieceId);
                    if (!allPosEvents[thisEventPosition].includes(arcftPieceId)) allPosEvents[thisEventPosition].push(arcftPieceId);
                }

                const eventInserts = [];
                const eventItemInserts = [];
                const keys = Object.keys(allPosEvents);
                for (let b = 0; b < keys.length; b++) {
                    const key = keys[b];
                    eventInserts.push([gameId, thisTeamNum, REFUEL_EVENT_TYPE, key, key]);
                    const eventPieces = allPosEvents[key];
                    for (let x = 0; x < eventPieces.length; x++) eventItemInserts.push([eventPieces[x], gameId, key, key]);
                }

                await Event.bulkInsertEvents(eventInserts);
                await Event.bulkInsertItems(gameId, eventItemInserts);
            }
        }
    }

    // TODO: Container Events (special flag)

    // Note: All non-move (specialflag != 0) plans should result in events (refuel/container)...
    // If there is now an event, send to user instead of PIECES_MOVE

    await giveNextEvent(socket, { thisGame, executingStep: true, gameTeam: BLUE_TEAM_ID });
    await giveNextEvent(socket, { thisGame, executingStep: true, gameTeam: RED_TEAM_ID });
};

export default executeStep;
