import { distanceMatrix } from "../../react-client/src/constants/distanceMatrix";
//prettier-ignore
import { AIRBORN_ISR_TYPE_ID, AIR_REFUELING_SQUADRON_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, ARTILLERY_BATTERY_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID, A_C_CARRIER_TYPE_ID, BLUE_TEAM_ID, BOMBER_TYPE_ID, C_130_TYPE_ID, DESTROYER_TYPE_ID, LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID, LIST_ALL_PIECES, MARINE_INFANTRY_COMPANY_TYPE_ID, MC_12_TYPE_ID, MISSILE_TYPE_ID, RADAR_TYPE_ID, RED_TEAM_ID, REMOTE_SENSING_RANGE, SAM_SITE_TYPE_ID, SOF_TEAM_TYPE_ID, STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID, SUBMARINE_TYPE_ID, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, TANK_COMPANY_TYPE_ID, TRANSPORT_TYPE_ID, TYPE_AIR_PIECES, TYPE_FUEL, TYPE_MOVES, VISIBILITY_MATRIX } from "../../react-client/src/constants/gameConstants";
import pool from "../database";

interface Piece {
    pieceId: number;
    pieceGameId: number;
    pieceTeamId: number;
    pieceTypeId: number;
    piecePositionId: number;
    pieceContainerId: number;
    pieceVisible: number;
    pieceMoves: number;
    pieceFuel: number;
    pieceContents?: any;

    pieceDisabled: boolean;
}

/**
 * Represents a row in the pieces database table.
 *
 * @class Piece
 */
class Piece {
    constructor(pieceId: number) {
        this.pieceId = pieceId;
    }

    /**
     * Gets information from database about this piece.
     *
     * @returns Piece
     * @memberof Piece
     */
    async init() {
        let queryString = "SELECT * FROM pieces WHERE pieceId = ?";
        let inserts = [this.pieceId];
        let [rows, fields] = await pool.query(queryString, inserts);

        if (rows.length != 1) {
            return null;
        }

        Object.assign(this, rows[0]);

        queryString = "SELECT * FROM goldenEyePieces WHERE pieceId = ?";
        inserts = [this.pieceId];
        [rows, fields] = await pool.query(queryString, inserts);
        this.pieceDisabled = rows.length !== 0;

        return this;
    }

    /**
     * Delete this piece.
     *
     * @memberof Piece
     */
    async delete() {
        const queryString = "DELETE FROM pieces WHERE pieceId = ?";
        const inserts = [this.pieceId];
        await pool.query(queryString, inserts);
    }

    /**
     * Delete the plans for this piece.
     *
     * @memberof Piece
     */
    async deletePlans() {
        //TODO: referencing another table, could potentially move this function (maybe)
        const queryString = "DELETE FROM plans WHERE planPieceId = ?";
        const inserts = [this.pieceId];
        await pool.query(queryString, inserts);
    }

    /**
     * Get the pieces that are within this piece.
     * Pieces become within another by setting pieceContainerId to id of the parent.
     *
     * @returns array of sql rows.
     * @memberof Piece
     */
    async getPiecesInside() {
        const queryString = "SELECT * FROM pieces WHERE pieceContainerId = ?";
        const inserts = [this.pieceId];
        const [allPieces] = await pool.query(queryString, inserts);
        return allPieces;
    }

    // prettier-ignore
    /**
     * Globally update each piece's visibility based on it's surroundings for this game.
     *
     * @static
     * @param {number} gameId
     * @memberof Piece
     */
    static async updateVisibilities(gameId: number) {
		const conn = await pool.getConnection();

		//set all to invisible
		let queryString = "UPDATE pieces SET pieceVisible = 0 WHERE pieceGameId = ?";
		let inserts = [gameId];
		await conn.query(queryString, inserts);

        //posTypes[teamToUpdate][typeToUpdate] = [...positionsThatThoseTypesAreVisibleOn]
        //TODO: this is bad code, do it the long and hard way or not at all (bug with adding pieces, other constants assume that (could make this array using those constants...))
		let posTypesVisible = [
			[[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
			[[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]]
		];

		//only need to check distinct pieces, (100 red tanks in same position == 1 red tank in same position)
		queryString = "SELECT DISTINCT pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId FROM pieces WHERE pieceGameId = ?";
		inserts = [gameId];
		let [pieces, fields] = await conn.query(queryString, inserts);

		let otherTeam;
		for (let x = 0; x < pieces.length; x++) {
			let { pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId } = pieces[x]; //TODO: pieces inside containers can't see rule?

            for (let type = 0; type < LIST_ALL_PIECES.length; type++) { //check each type
                let currentPieceType = LIST_ALL_PIECES[type];
				if (VISIBILITY_MATRIX[pieceTypeId][currentPieceType] !== -1) { //could it ever see this type?
					for (let position = 0; position < distanceMatrix[piecePositionId].length; position++) { //for all positions
						if (distanceMatrix[piecePositionId][position] <= VISIBILITY_MATRIX[pieceTypeId][currentPieceType]) { //is this position in range for that type?
							otherTeam = parseInt(pieceTeamId) == BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

							if (!posTypesVisible[otherTeam][type].includes(position)) { //add this position if not already added by another piece somewhere else
								posTypesVisible[otherTeam][type].push(position);
							}
						}
					}
				}
			}
		}

		//also check remote sensing effects
		queryString = "SELECT * FROM remoteSensing WHERE gameId = ?";
		inserts = [gameId];
		let [results, fields2] = await conn.query(queryString, inserts);

		for (let x = 0; x < results.length; x++) {
			let remoteSenseCenter = results[x].positionId;
			for (let currentPos = 0; currentPos < distanceMatrix[remoteSenseCenter].length; currentPos++) {
				if (distanceMatrix[remoteSenseCenter][currentPos] <= REMOTE_SENSING_RANGE) {
					//put these positions into the posTypesVisible (based on team)
					let { teamId } = results[x];
					let otherTeam = teamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;
					for (let pieceType = 0; pieceType < posTypesVisible[otherTeam].length; pieceType++) {
                        //does not see subs or sof teams
                        //could make a constant for pieces that are excluded from this effect, instead of manually checking each...
						if (!posTypesVisible[otherTeam][pieceType].includes(currentPos) && pieceType !== SOF_TEAM_TYPE_ID && pieceType !== SUBMARINE_TYPE_ID) { //add this position if not already added by another piece somewhere else
							posTypesVisible[otherTeam][pieceType].push(currentPos);
						}
					}
				}
			}
		}

        //Bulk update for all visibilities
        //TODO: update for radar and missile pieces
        //TODO: change this into something readable? (could also change the double array into a double object...)
		queryString = "UPDATE pieces SET pieceVisible = 1 WHERE pieceGameId = ? AND ((pieceTeamId = 0 AND pieceTypeId = 0 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 1 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 2 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 3 AND piecePositionId IN (?)) OR (pieceTeamId = 4 AND pieceTypeId = 1 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 5 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 6 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 7 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 8 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 9 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 10 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 11 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 12 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 13 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 14 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 15 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 16 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 17 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 18 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 19 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 20 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 21 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 0 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 1 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 2 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 3 AND piecePositionId IN (?)) OR (pieceTeamId = 4 AND pieceTypeId = 1 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 5 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 6 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 7 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 8 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 9 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 10 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 11 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 12 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 13 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 14 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 15 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 16 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 17 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 18 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 19 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 20 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 21 AND piecePositionId IN (?)))";
		let inserts4 = [gameId, posTypesVisible[BLUE_TEAM_ID][BOMBER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][STEALTH_BOMBER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][STEALTH_FIGHTER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][AIR_REFUELING_SQUADRON_ID], posTypesVisible[BLUE_TEAM_ID][TACTICAL_AIRLIFT_SQUADRON_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][AIRBORN_ISR_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][ARMY_INFANTRY_COMPANY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][ARTILLERY_BATTERY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][TANK_COMPANY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][MARINE_INFANTRY_COMPANY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][ATTACK_HELICOPTER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][SAM_SITE_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][DESTROYER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][A_C_CARRIER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][SUBMARINE_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][TRANSPORT_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][MC_12_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][C_130_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][SOF_TEAM_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][RADAR_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][MISSILE_TYPE_ID], posTypesVisible[RED_TEAM_ID][BOMBER_TYPE_ID], posTypesVisible[RED_TEAM_ID][STEALTH_BOMBER_TYPE_ID], posTypesVisible[RED_TEAM_ID][STEALTH_FIGHTER_TYPE_ID], posTypesVisible[RED_TEAM_ID][AIR_REFUELING_SQUADRON_ID], posTypesVisible[RED_TEAM_ID][TACTICAL_AIRLIFT_SQUADRON_TYPE_ID], posTypesVisible[RED_TEAM_ID][AIRBORN_ISR_TYPE_ID], posTypesVisible[RED_TEAM_ID][ARMY_INFANTRY_COMPANY_TYPE_ID], posTypesVisible[RED_TEAM_ID][ARTILLERY_BATTERY_TYPE_ID], posTypesVisible[RED_TEAM_ID][TANK_COMPANY_TYPE_ID], posTypesVisible[RED_TEAM_ID][MARINE_INFANTRY_COMPANY_TYPE_ID], posTypesVisible[RED_TEAM_ID][ATTACK_HELICOPTER_TYPE_ID], posTypesVisible[RED_TEAM_ID][LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID], posTypesVisible[RED_TEAM_ID][SAM_SITE_TYPE_ID], posTypesVisible[RED_TEAM_ID][DESTROYER_TYPE_ID], posTypesVisible[RED_TEAM_ID][A_C_CARRIER_TYPE_ID], posTypesVisible[RED_TEAM_ID][SUBMARINE_TYPE_ID], posTypesVisible[RED_TEAM_ID][TRANSPORT_TYPE_ID], posTypesVisible[RED_TEAM_ID][MC_12_TYPE_ID], posTypesVisible[RED_TEAM_ID][C_130_TYPE_ID], posTypesVisible[RED_TEAM_ID][SOF_TEAM_TYPE_ID], posTypesVisible[RED_TEAM_ID][RADAR_TYPE_ID], posTypesVisible[RED_TEAM_ID][MISSILE_TYPE_ID]];
		await conn.query(queryString, inserts4);

		conn.release();
	}

    /**
     * Globally move all pieces according to their plans for this game.
     *
     * @static
     * @param {number} gameId
     * @param {number} movementOrder
     * @memberof Piece
     */
    static async move(gameId: number, movementOrder: number) {
        //movement based on plans (for this order/step)
        const conn = await pool.getConnection();

        let inserts = [gameId, movementOrder];
        let movePiecesQuery =
            "UPDATE pieces, plans SET pieces.piecePositionId = plans.planPositionId, pieces.pieceMoves = pieces.pieceMoves - 1 WHERE pieces.pieceId = plans.planPieceId AND planGameId = ? AND plans.planMovementOrder = ? AND plans.planSpecialFlag = 0";
        await conn.query(movePiecesQuery, inserts);

        //update fuel (only for pieces that are restricted by fuel (air pieces))
        let inserts2 = [gameId, movementOrder, TYPE_AIR_PIECES];
        let removeFuel =
            "UPDATE pieces, plans SET pieces.pieceFuel = pieces.pieceFuel - 1 WHERE pieces.pieceId = plans.planPieceId AND planGameId = ? AND plans.planMovementOrder = ? AND plans.planSpecialFlag = 0 AND pieces.pieceTypeId in (?)";
        await conn.query(removeFuel, inserts2);

        let updateContents =
            "UPDATE pieces AS insidePieces JOIN pieces AS containerPieces ON insidePieces.pieceContainerId = containerPieces.pieceId SET insidePieces.piecePositionId = containerPieces.piecePositionId WHERE insidePieces.pieceGameId = ?";
        let newinserts = [gameId];
        await conn.query(updateContents, newinserts);
        await conn.query(updateContents, newinserts); //do it twice for containers within containers contained pieces to get updated (GENIUS LEVEL CODING RIGHT HERE)

        //TODO: referencing another table here...(could change to put into the plans class)
        const deletePlansQuery = "DELETE FROM plans WHERE planGameId = ? AND planMovementOrder = ? AND planSpecialFlag = 0";
        await conn.query(deletePlansQuery, inserts);

        //handle if the pieces moved into a bio / nuclear place
        let queryString = "SELECT * FROM biologicalWeapons WHERE gameId = ? AND activated = 1";
        let moreInserts = [gameId];
        const [results, fields3] = await conn.query(queryString, moreInserts);

        let listOfPositions = [];
        for (let x = 0; x < results.length; x++) {
            //delete the pieces in these positions
            let thisBioWeapon = results[x];
            let { positionId } = thisBioWeapon;
            listOfPositions.push(positionId);
        }

        //TODO: only do this for ground pieces...
        //TODO: only for ground pieces?
        if (listOfPositions.length > 0) {
            queryString = "DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)";
            let moreInserts2 = [gameId, listOfPositions];
            await conn.query(queryString, moreInserts2);
        }

        conn.release();
    }

    /**
     * Get dictionary of positions and the pieces those positions contain.
     *
     * @static
     * @param {number} gameId
     * @param {number} gameTeam
     * @returns dictionary of positions with pieces inside.
     * @memberof Piece
     */
    static async getVisiblePieces(gameId: number, gameTeam: number) {
        let queryString =
            "SELECT * FROM pieces WHERE pieceGameId = ? AND (pieceTeamId = ? OR pieceVisible = 1) ORDER BY pieceContainerId, pieceTeamId ASC";
        let inserts = [gameId, gameTeam];
        const [results, fields8] = await pool.query(queryString, inserts);

        queryString =
            "SELECT pieceId FROM goldenEyePieces NATURAL JOIN pieces WHERE goldenEyePieces.pieceId = pieces.pieceId AND pieces.pieceGameId = ?";
        inserts = [gameId];
        const [pieceIdsStuck, fields5] = await pool.query(queryString, inserts);
        let allPieceIdsStuck = [];
        for (let x = 0; x < pieceIdsStuck.length; x++) {
            allPieceIdsStuck.push(pieceIdsStuck[x].pieceId);
        }

        //format for the client state
        let allPieces: any = {};
        for (let x = 0; x < results.length; x++) {
            let currentPiece = results[x];
            if (allPieceIdsStuck.includes(currentPiece.pieceId)) {
                currentPiece.pieceDisabled = true;
            } else {
                currentPiece.pieceDisabled = false;
            }
            currentPiece.pieceContents = { pieces: [] };
            if (!allPieces[currentPiece.piecePositionId]) {
                allPieces[currentPiece.piecePositionId] = [];
            }
            //TODO: constant instead of -1
            if (currentPiece.pieceContainerId == -1) {
                allPieces[currentPiece.piecePositionId].push(currentPiece);
            } else {
                let indexOfParent = allPieces[currentPiece.piecePositionId].findIndex((piece: any) => {
                    return piece.pieceId == currentPiece.pieceContainerId;
                });
                if (indexOfParent == -1) {
                    //need to find grandparent, and find parent within pieceContents
                    //loop through all grandparent children to find actual parent?
                    //TODO: probably cleaner way of doing this logic, should also break from outer loop to be more efficient, since we are done
                    for (let x = 0; x < allPieces[currentPiece.piecePositionId].length; x++) {
                        let potentialGrandparent = allPieces[currentPiece.piecePositionId][x];
                        for (let y = 0; y < potentialGrandparent.pieceContents.pieces.length; y++) {
                            let potentialParent = potentialGrandparent.pieceContents.pieces[y];
                            if (potentialParent.pieceId == currentPiece.pieceContainerId) {
                                allPieces[currentPiece.piecePositionId][x].pieceContents.pieces[y].pieceContents.pieces.push(currentPiece);
                                break;
                            }
                        }
                    }
                } else {
                    allPieces[currentPiece.piecePositionId][indexOfParent].pieceContents.pieces.push(currentPiece);
                }
            }
        }

        return allPieces;
    }

    /**
     * Get sql results querying positions that should cause refuel event.
     * These positions are tankers + any same team aircraft.
     *
     * @static
     * @param {number} gameId
     * @param {number} gameTeam
     * @returns
     * @memberof Piece
     */
    static async getPositionRefuels(gameId: number, gameTeam: number) {
        //TODO: constant for 'outside container' instead of -1?
        const queryString =
            "SELECT tnkr.pieceId as tnkrPieceId, tnkr.pieceTypeId as tnkrPieceTypeId, tnkr.piecePositionId as tnkrPiecePositionId, tnkr.pieceMoves as tnkrPieceMoves, tnkr.pieceFuel as tnkrPieceFuel, arcft.pieceId as arcftPieceId, arcft.pieceTypeId as arcftPieceTypeId, arcft.piecePositionId as arcftPiecePositionId, arcft.pieceMoves as arcftPieceMoves, arcft.pieceFuel as arcftPieceFuel FROM (SELECT * FROM pieces WHERE pieceTypeId = 3 AND pieceGameId = ? AND pieceTeamId = ?) as tnkr JOIN (SELECT * FROM pieces WHERE pieceTypeId in (0, 1, 2, 4, 5, 17, 18) AND pieceGameId = ? AND pieceTeamId = ?) as arcft ON tnkr.piecePositionId = arcft.piecePositionId WHERE arcft.pieceContainerId = -1";
        const inserts = [gameId, gameTeam, gameId, gameTeam];
        const [results] = await pool.query(queryString, inserts);

        //TODO: should deal with results here and return with other things, or do entire function in this method... calling the other bulk inserts and stuff available?
        return results;
    }

    /**
     * Put 1 piece inside another container piece.
     *
     * @static
     * @param {*} selectedPiece
     * @param {*} containerPiece
     * @memberof Piece
     */
    static async putInsideContainer(selectedPiece: any, containerPiece: any) {
        //TODO: could combine into 1 query, or could have a selection for variable query, 1 request instead of 2 would be better

        let queryString = "UPDATE pieces SET pieceContainerId = ?, piecePositionId = ? WHERE pieceId = ?";
        let inserts = [containerPiece.pieceId, containerPiece.piecePositionId, selectedPiece.pieceId];
        await pool.query(queryString, inserts);

        //refuel the piece
        if (TYPE_AIR_PIECES.includes(selectedPiece.pieceTypeId)) {
            queryString = "UPDATE pieces SET pieceFuel = ? WHERE pieceId = ?";
            inserts = [TYPE_FUEL[selectedPiece.pieceTypeId], selectedPiece.pieceId];
            await pool.query(queryString, inserts);
        }
    }

    //TODO: could make this a non-static method? (since we already have the pieceId....)
    /**
     * Put 1 piece outside of it's parent piece.
     *
     * @static
     * @param {number} selectedPieceId
     * @param {number} newPositionId
     * @memberof Piece
     */
    static async putOutsideContainer(selectedPieceId: number, newPositionId: number) {
        //TODO: deal with inner transport pieces (need to also set the piecePositionId)
        let queryString = "UPDATE pieces SET pieceContainerId = -1, piecePositionId = ? WHERE pieceId = ?";
        let inserts = [newPositionId, selectedPieceId];
        await pool.query(queryString, inserts);
    }

    //TODO: change this into a pieceConstructor Object, bad practice to have so many parameters
    /**
     * Insert a single piece into the database for this game's team.
     *
     * @static
     * @param {number} pieceGameId
     * @param {number} pieceTeamId
     * @param {number} pieceTypeId
     * @param {number} piecePositionId
     * @param {number} pieceContainerId
     * @param {number} pieceVisible
     * @param {number} pieceMoves
     * @param {number} pieceFuel
     * @returns Piece that was inserted.
     * @memberof Piece
     */
    static async insert(
        pieceGameId: number,
        pieceTeamId: number,
        pieceTypeId: number,
        piecePositionId: number,
        pieceContainerId: number,
        pieceVisible: number,
        pieceMoves: number,
        pieceFuel: number
    ) {
        let queryString =
            "INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        let inserts = [pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel];
        const [results, fields] = await pool.query(queryString, inserts);
        const thisPiece = new Piece(results.insertId);
        Object.assign(thisPiece, {
            pieceGameId,
            pieceTeamId,
            pieceTypeId,
            piecePositionId,
            pieceContainerId,
            pieceVisible,
            pieceMoves,
            pieceFuel
        });
        return thisPiece;
    }

    /**
     * Globally reset moves for all pieces in this game.
     *
     * @static
     * @param {number} gameId
     * @memberof Piece
     */
    static async resetMoves(gameId: number) {
        const testquery =
            "UPDATE pieces SET pieceMoves = CASE WHEN pieceTypeId = 0 THEN ? WHEN pieceTypeId = 1 THEN ? WHEN pieceTypeId = 2 THEN ? WHEN pieceTypeId = 3 THEN ? WHEN pieceTypeId = 4 THEN ? WHEN pieceTypeId = 5 THEN ? WHEN pieceTypeId = 6 THEN ? WHEN pieceTypeId = 7 THEN ? WHEN pieceTypeId = 8 THEN ? WHEN pieceTypeId = 9 THEN ? WHEN pieceTypeId = 10 THEN ? WHEN pieceTypeId = 11 THEN ? WHEN pieceTypeId = 12 THEN ? WHEN pieceTypeId = 13 THEN ? WHEN pieceTypeId = 14 THEN ? WHEN pieceTypeId = 15 THEN ? WHEN pieceTypeId = 16 THEN ? WHEN pieceTypeId = 17 THEN ? WHEN pieceTypeId = 18 THEN ? WHEN pieceTypeId = 19 THEN ? END WHERE pieceGameId = ?";
        const inserts = [
            TYPE_MOVES[0],
            TYPE_MOVES[1],
            TYPE_MOVES[2],
            TYPE_MOVES[3],
            TYPE_MOVES[4],
            TYPE_MOVES[5],
            TYPE_MOVES[6],
            TYPE_MOVES[7],
            TYPE_MOVES[8],
            TYPE_MOVES[9],
            TYPE_MOVES[10],
            TYPE_MOVES[11],
            TYPE_MOVES[12],
            TYPE_MOVES[13],
            TYPE_MOVES[14],
            TYPE_MOVES[15],
            TYPE_MOVES[16],
            TYPE_MOVES[17],
            TYPE_MOVES[18],
            TYPE_MOVES[19],
            gameId
        ];
        await pool.query(testquery, inserts);
    }
}

export default Piece;
