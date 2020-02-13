// prettier-ignore
import { BLUE_TEAM_ID, BOTH_TEAMS_INDICATOR, CLEAR_SAM_DELETE, COL_BATTLE_EVENT_TYPE, DRONE_SWARM_HIT_NOTIFICATION, DRONE_SWARM_NOTIFY_CLEAR, NEW_ROUND, PLACE_PHASE, PLACE_PHASE_ID, POS_BATTLE_EVENT_TYPE, RED_TEAM_ID, REFUEL_EVENT_TYPE, ROUNDS_PER_COMBAT_PHASE, SAM_DELETED_PIECES, SEA_MINE_HIT_NOTIFICATION, SEA_MINE_NOTIFY_CLEAR, UPDATE_AIRFIELDS, UPDATE_FLAGS, WAITING_STATUS } from '../../constants';
// prettier-ignore
import { ClearDroneSwarmMineNotifyAction, ClearSamDeleteAction, ClearSeaMineNotifyAction, DroneSwarmHitNotifyAction, NewRoundAction, PlacePhaseAction, SamDeletedPiecesAction, SeaMineHitNotifyAction, SocketSession, UpdateAirfieldAction, UpdateFlagAction, BlueOrRedTeamId, PlanType } from '../../types';
import { Capability, Event, Game, Piece, Plan } from '../classes';
import { sendToGame, sendToTeam } from '../helpers';
import { giveNextEvent } from './giveNextEvent';

/**
 * Move pieces / step through plans
 */
export const executeStep = async (session: SocketSession, thisGame: Game) => {
    // inserting events here and moving pieces, or changing to new round or something...
    const { gameId, gameRound } = thisGame;

    // TODO: rename this to 'hadPlans0' or something more descriptive
    const currentMovementOrderBlue = await Plan.getCurrentMovementOrder(gameId, BLUE_TEAM_ID);
    const currentMovementOrderRed = await Plan.getCurrentMovementOrder(gameId, RED_TEAM_ID);

    // No More Plans for either team -> end of the round
    // DOESN'T MAKE PLANS FOR PIECES STILL IN THE SAME POSITION...NEED TO HAVE AT LEAST 1 PLAN FOR ANYTHING TO HAPPEN (pieces in same postion would battle (again?) if there was 1 plan elsewhere...)
    if (currentMovementOrderBlue == null && currentMovementOrderRed == null) {
        await thisGame.setSlice(0); // if no more moves, end of slice 1

        await Piece.resetMoves(gameId); // TODO: could move this functionality to Game (no need to pass in the gameId)

        // Decrease game effects that last for x rounds
        await Capability.decreaseCyberDefense(gameId);
        await Capability.decreaseRemoteSensing(gameId);
        await Capability.decreaseBiologicalWeapons(gameId);
        await Capability.decreaseGoldenEye(gameId);
        await Capability.decreaseCommInterrupt(gameId);
        await Capability.decreaseRaiseMorale(gameId);
        await Capability.decreaseDroneSwarms(gameId);
        await Capability.decreaseAtcScramble(gameId);
        await Capability.decreaseAntiSat(gameId);
        await Capability.decreaseMissileDisrupt(gameId);

        if (gameRound === ROUNDS_PER_COMBAT_PHASE) {
            // Combat -> Place Phase
            await thisGame.setRound(0);
            await thisGame.setPhase(PLACE_PHASE_ID);

            await Piece.deletePlanesWithoutFuel(gameId);

            const placePhaseActionBlue: PlacePhaseAction = {
                type: PLACE_PHASE,
                payload: {
                    gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
                    confirmedRemoteSense: await Capability.getRemoteSensing(gameId, BLUE_TEAM_ID),
                    confirmedBioWeapons: await Capability.getBiologicalWeapons(gameId, BLUE_TEAM_ID),
                    confirmedRaiseMorale: await Capability.getRaiseMorale(gameId, BLUE_TEAM_ID),
                    confirmedCommInterrupt: await Capability.getCommInterrupt(gameId, BLUE_TEAM_ID),
                    confirmedGoldenEye: await Capability.getGoldenEye(gameId, BLUE_TEAM_ID),
                    confirmedSeaMines: await Capability.getSeaMines(gameId, BLUE_TEAM_ID),
                    confirmedDroneSwarms: await Capability.getDroneSwarms(gameId, BLUE_TEAM_ID),
                    confirmedAtcScramble: await Capability.getAtcScramble(gameId, BLUE_TEAM_ID),
                    confirmedNukes: await Capability.getNukes(gameId, BLUE_TEAM_ID),
                    confirmedAntiSat: await Capability.getAntiSat(gameId, BLUE_TEAM_ID),
                    confirmedMissileDisrupts: await Capability.getMissileDisrupt(gameId, BLUE_TEAM_ID),
                    cyberDefenseIsActive: await Capability.getCyberDefense(gameId, BLUE_TEAM_ID)
                }
            };
            const placePhaseActionRed: PlacePhaseAction = {
                type: PLACE_PHASE,
                payload: {
                    gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
                    confirmedRemoteSense: await Capability.getRemoteSensing(gameId, RED_TEAM_ID),
                    confirmedBioWeapons: await Capability.getBiologicalWeapons(gameId, RED_TEAM_ID),
                    confirmedRaiseMorale: await Capability.getRaiseMorale(gameId, RED_TEAM_ID),
                    confirmedCommInterrupt: await Capability.getCommInterrupt(gameId, RED_TEAM_ID),
                    confirmedGoldenEye: await Capability.getGoldenEye(gameId, RED_TEAM_ID),
                    confirmedSeaMines: await Capability.getSeaMines(gameId, RED_TEAM_ID),
                    confirmedDroneSwarms: await Capability.getDroneSwarms(gameId, RED_TEAM_ID),
                    confirmedAtcScramble: await Capability.getAtcScramble(gameId, RED_TEAM_ID),
                    confirmedNukes: await Capability.getNukes(gameId, RED_TEAM_ID),
                    confirmedAntiSat: await Capability.getAntiSat(gameId, RED_TEAM_ID),
                    confirmedMissileDisrupts: await Capability.getMissileDisrupt(gameId, RED_TEAM_ID),
                    cyberDefenseIsActive: await Capability.getCyberDefense(gameId, RED_TEAM_ID)
                }
            };

            sendToTeam(gameId, BLUE_TEAM_ID, placePhaseActionBlue);
            sendToTeam(gameId, RED_TEAM_ID, placePhaseActionRed);
            return;
        }
        // Next Round of Combat
        await thisGame.setRound(gameRound + 1);

        await Piece.deletePlanesWithoutFuel(gameId);

        const newRoundActionBlue: NewRoundAction = {
            type: NEW_ROUND,
            payload: {
                gameRound: thisGame.gameRound,
                gameboardPieces: await Piece.getVisiblePieces(gameId, BLUE_TEAM_ID),
                confirmedRemoteSense: await Capability.getRemoteSensing(gameId, BLUE_TEAM_ID),
                confirmedBioWeapons: await Capability.getBiologicalWeapons(gameId, BLUE_TEAM_ID),
                confirmedRaiseMorale: await Capability.getRaiseMorale(gameId, BLUE_TEAM_ID),
                confirmedCommInterrupt: await Capability.getCommInterrupt(gameId, BLUE_TEAM_ID),
                confirmedGoldenEye: await Capability.getGoldenEye(gameId, BLUE_TEAM_ID),
                confirmedSeaMines: await Capability.getSeaMines(gameId, BLUE_TEAM_ID),
                confirmedDroneSwarms: await Capability.getDroneSwarms(gameId, BLUE_TEAM_ID),
                confirmedAtcScramble: await Capability.getAtcScramble(gameId, BLUE_TEAM_ID),
                confirmedNukes: await Capability.getNukes(gameId, BLUE_TEAM_ID),
                confirmedAntiSat: await Capability.getAntiSat(gameId, BLUE_TEAM_ID),
                confirmedMissileDisrupts: await Capability.getMissileDisrupt(gameId, BLUE_TEAM_ID),
                cyberDefenseIsActive: await Capability.getCyberDefense(gameId, BLUE_TEAM_ID)
            }
        };
        const newRoundActionRed: NewRoundAction = {
            type: NEW_ROUND,
            payload: {
                gameRound: thisGame.gameRound,
                gameboardPieces: await Piece.getVisiblePieces(gameId, RED_TEAM_ID),
                confirmedRemoteSense: await Capability.getRemoteSensing(gameId, RED_TEAM_ID),
                confirmedBioWeapons: await Capability.getBiologicalWeapons(gameId, RED_TEAM_ID),
                confirmedRaiseMorale: await Capability.getRaiseMorale(gameId, RED_TEAM_ID),
                confirmedCommInterrupt: await Capability.getCommInterrupt(gameId, RED_TEAM_ID),
                confirmedGoldenEye: await Capability.getGoldenEye(gameId, RED_TEAM_ID),
                confirmedSeaMines: await Capability.getSeaMines(gameId, RED_TEAM_ID),
                confirmedDroneSwarms: await Capability.getDroneSwarms(gameId, RED_TEAM_ID),
                confirmedAtcScramble: await Capability.getAtcScramble(gameId, RED_TEAM_ID),
                confirmedNukes: await Capability.getNukes(gameId, RED_TEAM_ID),
                confirmedAntiSat: await Capability.getAntiSat(gameId, RED_TEAM_ID),
                confirmedMissileDisrupts: await Capability.getMissileDisrupt(gameId, RED_TEAM_ID),
                cyberDefenseIsActive: await Capability.getCyberDefense(gameId, RED_TEAM_ID)
            }
        };

        sendToTeam(gameId, BLUE_TEAM_ID, newRoundActionBlue);
        sendToTeam(gameId, RED_TEAM_ID, newRoundActionRed);
        return;
    }

    // TODO: this is no longer necessary, everyone has the same amount of plans (only battles now)
    // One of the teams may be without plans, keep them waiting
    if (currentMovementOrderBlue == null) {
        await thisGame.setStatus(BLUE_TEAM_ID, WAITING_STATUS);
    }
    if (currentMovementOrderRed == null) {
        await thisGame.setStatus(RED_TEAM_ID, WAITING_STATUS);
    }

    const currentMovementOrder: PlanType['planMovementOrder'] = currentMovementOrderBlue != null ? currentMovementOrderBlue : currentMovementOrderRed;

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

    const positionsThatWereHit = await Capability.checkSeaMineHit(gameId);
    if (positionsThatWereHit.length !== 0) {
        // need to send to client that these positions were hit
        const seaMineHitNotifyAction: SeaMineHitNotifyAction = {
            type: SEA_MINE_HIT_NOTIFICATION,
            payload: {
                positionsToHighlight: positionsThatWereHit
            }
        };

        // Send all flag updates to every team
        sendToGame(gameId, seaMineHitNotifyAction);

        const clearSeaMineNotifyAction: ClearSeaMineNotifyAction = {
            type: SEA_MINE_NOTIFY_CLEAR,
            payload: {}
        };

        setTimeout(() => {
            sendToGame(gameId, clearSeaMineNotifyAction);
        }, 5000);
    }

    // TODO: should combine network requests (instead of doing things twice)
    const dronePositionsThatWereHit = await Capability.checkDroneSwarmHit(gameId);
    if (dronePositionsThatWereHit.length !== 0) {
        // need to send to client that these positions were hit
        const droneSwarmHitNotifyAction: DroneSwarmHitNotifyAction = {
            type: DRONE_SWARM_HIT_NOTIFICATION,
            payload: {
                positionsToHighlight: dronePositionsThatWereHit
            }
        };

        // Send all flag updates to every team
        sendToGame(gameId, droneSwarmHitNotifyAction);

        const clearDroneSwarmNotifyAction: ClearDroneSwarmMineNotifyAction = {
            type: DRONE_SWARM_NOTIFY_CLEAR,
            payload: {}
        };

        setTimeout(() => {
            // TODO: can make 'clear notify stuff' a single action that just clears both sea mine and swarm, since they will always happen this way
            sendToGame(gameId, clearDroneSwarmNotifyAction);
        }, 5000);
    }

    await Piece.move(gameId, currentMovementOrder); // changes the piecePositionId, deletes the plan

    await Capability.sofTakeoutAirfieldsAndSilos(thisGame);

    const listOfPiecesDeletedFromSams = await Piece.samFire(thisGame); // TODO: need tell client which positions were hit by sams
    if (listOfPiecesDeletedFromSams.length !== 0) {
        // send to the teams for display / highlighting
        const samDeletedPiecesAction: SamDeletedPiecesAction = {
            type: SAM_DELETED_PIECES,
            payload: {
                listOfDeletedPieces: listOfPiecesDeletedFromSams
            }
        };

        sendToGame(gameId, samDeletedPiecesAction);

        const clearSamDeleteAction: ClearSamDeleteAction = {
            type: CLEAR_SAM_DELETE,
            payload: {
                listOfDeletedPieces: listOfPiecesDeletedFromSams
            }
        };

        setTimeout(() => {
            sendToGame(gameId, clearSamDeleteAction);
        }, 10000); // TODO: constant for these settimeout times?
    }

    await Piece.deletePlanesWithoutFuel(gameId);

    await Piece.giveFuelToHelisOverLand(gameId);

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
        sendToGame(gameId, updateFlagAction);
    }

    // TODO: combine with flag updates (less requests)

    const didUpdateAirfields = await thisGame.updateAirfields();
    if (didUpdateAirfields) {
        const updateAirfieldAction: UpdateAirfieldAction = {
            type: UPDATE_AIRFIELDS,
            payload: {
                airfield0: thisGame.airfield0,
                airfield1: thisGame.airfield1,
                airfield2: thisGame.airfield2,
                airfield3: thisGame.airfield3,
                airfield4: thisGame.airfield4,
                airfield5: thisGame.airfield5,
                airfield6: thisGame.airfield6,
                airfield7: thisGame.airfield7,
                airfield8: thisGame.airfield8,
                airfield9: thisGame.airfield9
            }
        };

        // Send all airfield updates to every team
        sendToGame(gameId, updateAirfieldAction);
    }

    await Piece.refuelPlanesOverAirfields(thisGame);

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
    const teamHadPlans = [currentMovementOrderBlue == null ? 0 : 1, currentMovementOrderRed == null ? 0 : 1];
    for (let thisTeamNum = 0; thisTeamNum < 2; thisTeamNum++) {
        if (teamHadPlans[thisTeamNum]) {
            // refuel events if they had plans for this step, otherwise don't want to refuel stuff for no plans (possibly will do it anyway)
            // need to grab all refuel events from database, looking at pieces in the same positions
            const allPositionRefuels: any = await Piece.getPositionRefuels(gameId, thisTeamNum as BlueOrRedTeamId); // TODO: probably a way of not doing 'as Blue', loop declaration is messing up the types, should iterate through array of both values somehow
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

    // If there is now an event, send to user instead of PIECES_MOVE
    await giveNextEvent(session, { thisGame, gameTeam: BLUE_TEAM_ID });
    await giveNextEvent(session, { thisGame, gameTeam: RED_TEAM_ID });
};
