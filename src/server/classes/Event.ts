import { ATTACK_MATRIX } from "../../react-client/src/constants/gameConstants";
import pool from "../database";
import { EventType } from "../../react-client/src/constants/interfaces";

/**
 * Represents event row in eventqueue table in the database.
 * Also contains other helping functions that deal with events and event items.
 *
 * @class Event
 */
class Event implements EventType {
    eventId: number;
    eventGameId: number;
    eventTeamId: number;
    eventTypeId: number;
    eventPosA: number;
    eventPosB: number;

    //TODO: we have a class for event, but multiple tables for keeping track of events, event items, and that one for temp stuff (efficient)
    constructor(eventId: number, options: any) {
        this.eventId = eventId;
        if (options) {
            Object.assign(this, options);
        }
    }

    /**
     * Get information about this event from the database.
     *
     * @returns
     * @memberof Event
     */
    async init() {
        //TODO: this may not be ever called, check since we now instantiate from static methods?
        const queryString = "SELECT * FROM eventQueue WHERE eventId = ?";
        const inserts = [this.eventId];
        const [results, fields] = await pool.query(queryString, inserts);

        if (results.length != 1) {
            return null;
        } else {
            Object.assign(this, results[0]);
            return this;
        }
    }

    /**
     * Delete this event from the database.
     *
     * @memberof Event
     */
    async delete() {
        const queryString = "DELETE FROM eventQueue WHERE eventId = ?";
        const inserts = [this.eventId];
        await pool.query(queryString, inserts);
    }

    /**
     * Get sql array of eventItems/pieces that are tied to this event.
     *
     * @returns
     * @memberof Event
     */
    async getItems() {
        const queryString = "SELECT * FROM eventItems NATURAL JOIN pieces WHERE eventId = ? AND eventPieceId = pieceId";
        const inserts = [this.eventId];
        const [eventItems, fields] = await pool.query(queryString, inserts);

        if (eventItems.length == 0) {
            return null;
        } else {
            return eventItems;
        }
    }

    //TODO: should change this to resond to eventType (change SELECT)...instead of also having getRefuelItems
    /**
     * getItems() but for a specific team.
     *
     * @param {number} gameTeam
     * @returns
     * @memberof Event
     */
    async getTeamItems(gameTeam: number) {
        const queryString =
            "SELECT * FROM (SELECT * FROM eventItems NATUAL JOIN pieces WHERE eventPieceId = pieceId AND eventId = ? AND pieceTeamId = ?) a LEFT JOIN (SELECT pieceId as tpieceId, pieceGameId as tpieceGameId, pieceTeamId as tpieceTeamId, pieceTypeId as tpieceTypeId, piecePositionId as tpiecePositionId, pieceContainerId as tpieceContainerId, pieceVisible as tpieceVisible, pieceMoves as tpieceMoves, pieceFuel as tpieceFuel FROM pieces) b ON a.eventItemTarget = b.tpieceId";
        const inserts = [this.eventId, gameTeam];
        const [eventTeamItems] = await pool.query(queryString, inserts);
        return eventTeamItems; //TODO: do we need to return null explicitly? (this is an empty array ^^^ see getItems for difference (not sure why needed))
    }

    /**
     * Get pieces for a refuel event. (same as getItems)
     *
     * @returns
     * @memberof Event
     */
    async getRefuelItems() {
        const queryString = "SELECT * FROM eventItems NATURAL JOIN pieces WHERE eventId = ? AND pieceId = eventPieceId";
        const inserts = [this.eventId];
        const [eventRefuelItems] = await pool.query(queryString, inserts);
        return eventRefuelItems;
    }

    /**
     * Get the next event from the eventQueue.
     *
     * @static
     * @param {number} gameId
     * @param {number} gameTeam
     * @returns
     * @memberof Event
     */
    static async getNext(gameId: number, gameTeam: number) {
        const queryString = "SELECT * FROM eventQueue WHERE eventGameId = ? AND (eventTeamId = ? OR eventTeamId = 2) ORDER BY eventId ASC LIMIT 1";
        const inserts = [gameId, gameTeam];
        const [events, fields] = await pool.query(queryString, inserts);

        if (events.length != 1) {
            //was limiting 1 from query, so should be 1 or 0
            return null;
        } else {
            const thisEvent = new Event(events[0]["eventId"], events[0]); //don't need to init, already got all the info from first query
            return thisEvent;
        }
    }

    //TODO: this function not called anymore, unlikely to need it...
    /**
     * Get the next event in the queue regardless of team.
     *
     * @static
     * @param {number} gameId
     * @returns
     * @memberof Event
     */
    static async getNextAnyteam(gameId: number) {
        const queryString = "SELECT * FROM eventQueue WHERE eventGameId = ? ORDER BY eventId ASC LIMIT 1";
        const inserts = [gameId];
        const [events, fields] = await pool.query(queryString, inserts);

        if (events.length != 1) {
            return null;
        } else {
            const thisEvent = new Event(events[0]["eventId"], events[0]);
            return thisEvent;
        }
    }

    /**
     * Insert events as a bulk insert sql query.
     *
     * @static
     * @param {*} allInserts
     * @memberof Event
     */
    static async bulkInsertEvents(allInserts: any) {
        const queryString = "INSERT INTO eventQueue (eventGameId, eventTeamId, eventTypeId, eventPosA, eventPosB) VALUES ?";
        const inserts = [allInserts];
        await pool.query(queryString, inserts);
    }

    /**
     * Insert eventItems as a bulk insert sql query.
     *
     * @static
     * @param {number} gameId
     * @param {*} allInserts
     * @memberof Event
     */
    static async bulkInsertItems(gameId: number, allInserts: any) {
        const conn = await pool.getConnection();

        let queryString = "INSERT INTO eventItemsTemp (eventPieceId, eventItemGameId, eventPosA, eventPosB) VALUES ?";
        let inserts = [allInserts];
        await conn.query(queryString, inserts);

        queryString =
            "INSERT INTO eventItems (eventId, eventPieceId) SELECT eventId, eventPieceId FROM eventItemsTemp NATURAL JOIN eventQueue WHERE eventItemsTemp.eventPosA = eventQueue.eventPosA AND eventItemsTemp.eventPosB = eventQueue.eventPosB AND eventItemsTemp.eventItemGameId = eventQueue.eventGameId";
        await conn.query(queryString);

        queryString = "DELETE FROM eventItemsTemp WHERE eventItemGameId = ?";
        inserts = [gameId];
        await conn.query(queryString, inserts);

        conn.release();
    }

    /**
     * Update eventItem's targets with a bulk insert and update using a temp table.
     *
     * @param {*} piecesWithTargets
     * @memberof Event
     */
    async bulkUpdateTargets(piecesWithTargets: any) {
        //TODO: make sure that these piece->targets make sense (prevent bad targetting? (if possible...))
        if (piecesWithTargets.length > 0) {
            let allInserts = [];
            for (let x = 0; x < piecesWithTargets.length; x++) {
                let { piece, targetPiece } = piecesWithTargets[x];
                let newInsert = [this.eventId, piece.pieceId, targetPiece == null ? -1 : targetPiece.pieceId, this.eventGameId];
                allInserts.push(newInsert);
            }

            let queryString = "INSERT INTO eventItemsTargetsTemp (eventId, eventPieceId, eventItemTarget, eventItemGameId) VALUES ?";
            let inserts = [allInserts];
            await pool.query(queryString, inserts);

            queryString =
                "UPDATE eventItems, eventItemsTargetsTemp SET eventItems.eventItemTarget = eventItemsTargetsTemp.eventItemTarget WHERE eventItems.eventId = eventItemsTargetsTemp.eventId AND eventItems.eventPieceId = eventItemsTargetsTemp.eventPieceId";
            await pool.query(queryString);

            queryString = "DELETE FROM eventItemsTargetsTemp WHERE eventItemGameId = ?";
            let inserts2 = [this.eventGameId];
            await pool.query(queryString, inserts2);
        }
    }

    /**
     * Update piece fuels from fuelUpdates list. (bulk query with temp table)
     *
     * @param {*} fuelUpdates
     * @param {number} gameTeam
     * @returns
     * @memberof Event
     */
    async bulkUpdatePieceFuels(fuelUpdates: any, gameTeam: number) {
        if (fuelUpdates.length == 0) {
            return;
        }

        let allInserts = [];
        for (let x = 0; x < fuelUpdates.length; x++) {
            let { pieceId, newFuel } = fuelUpdates[x]; //assuming this is what is inside of it, should probably check
            let newInsert = [pieceId, this.eventGameId, gameTeam, newFuel];
            allInserts.push(newInsert);
        }

        let queryString = "INSERT INTO pieceRefuelTemp (pieceId, gameId, teamId, newFuel) VALUES ?";
        let inserts = [allInserts];
        await pool.query(queryString, inserts);

        queryString =
            "UPDATE pieces, pieceRefuelTemp SET pieces.pieceFuel = pieceRefuelTemp.newFuel WHERE pieces.pieceId = pieceRefuelTemp.pieceId AND pieces.pieceTeamId = pieceRefuelTemp.teamId";
        await pool.query(queryString);

        queryString = "DELETE FROM pieceRefuelTemp WHERE gameId = ? AND teamId = ?";
        let inserts2 = [this.eventGameId, gameTeam];
        await pool.query(queryString, inserts2);
    }

    //prettier-ignore
    /**
     * Using eventItem targets, perform dice rolls between pieces and determine success or failure.
     *
     * @returns
     * @memberof Event
     */
    async fight() {
		let queryString =
			"SELECT * FROM (SELECT * FROM eventItems NATUAL JOIN pieces WHERE eventPieceId = pieceId AND eventId = ?) a LEFT JOIN (SELECT pieceId as tpieceId, pieceGameId as tpieceGameId, pieceTeamId as tpieceTeamId, pieceTypeId as tpieceTypeId, piecePositionId as tpiecePositionId, pieceContainerId as tpieceContainerId, pieceVisible as tpieceVisible, pieceMoves as tpieceMoves, pieceFuel as tpieceFuel FROM pieces) b ON a.eventItemTarget = b.tpieceId";
		let inserts = [this.eventId];
		const [eventItemsWithTargets, fields] = await pool.query(queryString, inserts);

		//need to know if any battles, and if 0 battles, end the event
		let atLeastOneBattle = false;
		for (let t = 0; t < eventItemsWithTargets.length; t++) {
			//assume that anything inserted into the database was legit (that piece had valid attack...etc)
			if (eventItemsWithTargets[t].tpieceId != null) {
				atLeastOneBattle = true;
				break;
			}
		}

		let fightResults: any = {
			atLeastOneBattle
		};

		if (atLeastOneBattle) {
			let piecesToDelete = [-1]; //need at least 1 value for sql to work?
			let masterRecord = [];  //for the client to handle...(future may do more things for client in advance...)
		
			for (let x = 0; x < eventItemsWithTargets.length; x++) {
				let thisEventItem = eventItemsWithTargets[x];
				let { pieceId, pieceTypeId, tpieceId, tpieceTypeId } = thisEventItem;
				//is there a target?
				if (tpieceId == null) {
					//nothing new, no dice...
					masterRecord.push({
						pieceId,
						targetId: null,  //probably not needed....
						diceRoll: null,
						win: false
					});
				} else {
					//do a dice roll
					//figure out needed value for success
					let neededValue = ATTACK_MATRIX[pieceTypeId][tpieceTypeId];
					var diceRolledResult1 = Math.floor(Math.random() * 6) + 1;
					var diceRolledResult2 = Math.floor(Math.random() * 6) + 1;
					let diceRollValue = diceRolledResult1+diceRolledResult2;
	
					//> or >=?
					if (diceRollValue >= neededValue) {
						//something happens!, show dice, highlight probably
						//bulk update add? //bulk delete?
						piecesToDelete.push(tpieceId);
						masterRecord.push({
							pieceId,
							diceRoll: diceRollValue,
							targetId: tpieceId,
							win: true,
							diceRoll1: diceRolledResult1,
							diceRoll2: diceRolledResult2
						});
					} else {
						//nothing happens, show dice, don't highlight?
						masterRecord.push({
							pieceId,
							diceRoll: diceRollValue,
							targetId: tpieceId,
							win: false,
							diceRoll1: diceRolledResult1,
							diceRoll2: diceRolledResult2
						});
					}
				}
			}
	
			//delete pieces if they are in the array (BULK DELETE QUERY)
			//TODO: move this functionality to the piece class?
			queryString = "DELETE FROM pieces WHERE pieceId IN (?)";
			let inserts2 = [piecesToDelete];
			await pool.query(queryString, inserts2);

			//prevents seeing previous attack from refresh*
			queryString = "UPDATE eventItems SET eventItemTarget = -1 WHERE eventId = ?";
			inserts = [this.eventId];
			await pool.query(queryString, inserts);

			//need to return the master record? and something else?
			fightResults.masterRecord = masterRecord;
		}

		return fightResults;
	}
}

export default Event;
