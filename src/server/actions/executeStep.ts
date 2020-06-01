// prettier-ignore
import { BLUE_TEAM_ID, PLACE_PHASE_ID, RED_TEAM_ID, ROUNDS_PER_COMBAT_PHASE, WAITING_STATUS } from '../../constants';
// prettier-ignore
import { ClearDroneSwarmMineNotifyAction, ClearSamDeleteAction, ClearSeaMineNotifyAction, CLEAR_SAM_DELETE, DroneSwarmHitNotifyAction, DRONE_SWARM_HIT_NOTIFICATION, DRONE_SWARM_NOTIFY_CLEAR, NewRoundAction, NEW_ROUND, PlacePhaseAction, PLACE_PHASE, PlanType, SamDeletedPiecesAction, SAM_DELETED_PIECES, SeaMineHitNotifyAction, SEA_MINE_HIT_NOTIFICATION, SEA_MINE_NOTIFY_CLEAR, SocketSession, UpdateAirfieldAction, UpdateFlagAction, UPDATE_AIRFIELDS, UPDATE_FLAGS } from '../../types';
import { Battle, Capability, Game, Piece, Plan, decreaseNewsEffect } from '../classes';
import { sendToGame, sendToTeam } from '../helpers';
import { giveNextBattle } from './battles';

/**
 * Move pieces / step through plans / create battles to handle
 */
export const executeStep = async (session: SocketSession, thisGame: Game) => {
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
        await decreaseNewsEffect(gameId);

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

    // One of the teams may be without plans, keep them waiting
    if (currentMovementOrderBlue == null) {
        await thisGame.setStatus(BLUE_TEAM_ID, WAITING_STATUS);
    }
    if (currentMovementOrderRed == null) {
        await thisGame.setStatus(RED_TEAM_ID, WAITING_STATUS);
    }

    // Both should be the same, until one runs out of plans before the other
    const currentMovementOrder: PlanType['planMovementOrder'] = currentMovementOrderBlue != null ? currentMovementOrderBlue : currentMovementOrderRed;

    // Collision Battles
    const allCollisions: any = await Plan.getCollisions(gameId, currentMovementOrder); // each item in collisionBattles has {pieceId0, pieceTypeId0, pieceContainerId0, piecePositionId0, planPositionId0, pieceId1, pieceTypeId1, pieceContainerId1, piecePositionId1, planPositionId1 }
    if (allCollisions.length > 0) {
        const allCollideBattles: any = {}; // 'position0-position1' => [piecesInvolved]

        for (let x = 0; x < allCollisions.length; x++) {
            const { pieceId0, piecePositionId0, planPositionId0, pieceId1 } = allCollisions[x];

            // TODO: figure out if these 2 pieces would actually collide / battle (do the same for position battles)
            // consider visibility

            const thisBattlePositions = `${piecePositionId0}-${planPositionId0}`;
            if (!Object.keys(allCollideBattles).includes(thisBattlePositions)) allCollideBattles[thisBattlePositions] = [];
            if (!allCollideBattles[thisBattlePositions].includes(pieceId0)) allCollideBattles[thisBattlePositions].push(pieceId0);
            if (!allCollideBattles[thisBattlePositions].includes(pieceId1)) allCollideBattles[thisBattlePositions].push(pieceId1);
        }

        const battleInserts = [];
        const battleItemInserts = [];
        const keys = Object.keys(allCollideBattles);
        for (let b = 0; b < keys.length; b++) {
            const key = keys[b];
            battleInserts.push([gameId, parseInt(key.split('-')[0]), parseInt(key.split('-')[1])]);
            const battlePieces = allCollideBattles[key];
            for (let x = 0; x < battlePieces.length; x++) battleItemInserts.push([battlePieces[x], gameId, key.split('-')[0], key.split('-')[1]]);
        }

        await Battle.bulkInsertBattles(battleInserts);
        await Battle.bulkInsertItems(gameId, battleItemInserts);
    }

    // Sea Mine Hit Check
    // TODO: somehow consolidate this with collision battles? (crossing into position = battle, but sea mine will hit and destroy piece anyway before the battle....)
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

    const listOfPiecesDeletedFromSams = await Piece.samFire(thisGame);
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

    await Piece.refuelPlanesOverAirfields(thisGame);
    await Piece.giveFuelToHelisOverLand(gameId);
    await Piece.deletePlanesWithoutFuel(gameId);

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

    // Position Battles
    const allPositionCombinations: any = await Plan.getPositionCombinations(gameId);
    if (allPositionCombinations.length > 0) {
        const allPosBattles: any = {};
        for (let x = 0; x < allPositionCombinations.length; x++) {
            const { pieceId0, piecePositionId0, pieceId1 } = allPositionCombinations[x];

            // consider if they would fight (see collision)
            // consider visibility

            const thisBattlePosition = `${piecePositionId0}`;
            if (!Object.keys(allPosBattles).includes(thisBattlePosition)) allPosBattles[thisBattlePosition] = [];
            if (!allPosBattles[thisBattlePosition].includes(pieceId0)) allPosBattles[thisBattlePosition].push(pieceId0);
            if (!allPosBattles[thisBattlePosition].includes(pieceId1)) allPosBattles[thisBattlePosition].push(pieceId1);
        }

        const battleInserts = [];
        const battleItemInserts = [];
        const keys = Object.keys(allPosBattles);
        for (let b = 0; b < keys.length; b++) {
            const key = keys[b];
            battleInserts.push([gameId, parseInt(key), parseInt(key)]);
            const battlePieces = allPosBattles[key];
            for (let x = 0; x < battlePieces.length; x++) battleItemInserts.push([battlePieces[x], gameId, key, key]);
        }

        await Battle.bulkInsertBattles(battleInserts);
        await Battle.bulkInsertItems(gameId, battleItemInserts);
    }

    await giveNextBattle(thisGame);
};
