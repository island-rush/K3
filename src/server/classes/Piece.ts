// prettier-ignore
import { OkPacket, RowDataPacket } from 'mysql2/promise';
// prettier-ignore
import { ACTIVATED, AIRBORN_ISR_TYPE_ID, AIR_REFUELING_SQUADRON_ID, ALL_AIRFIELD_LOCATIONS, ALL_LAND_POSITIONS, ARMY_INFANTRY_COMPANY_TYPE_ID, ARTILLERY_BATTERY_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID, A_C_CARRIER_TYPE_ID, BLUE_TEAM_ID, BOMBER_TYPE_ID, C_130_TYPE_ID, DESTROYER_TYPE_ID, distanceMatrix, DRAGON_ISLAND_ID, EAGLE_ISLAND_ID, FULLER_ISLAND_ID, HR_REPUBLIC_ISLAND_ID, ISLAND_POSITIONS, KEONI_ISLAND_ID, LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID, LION_ISLAND_ID, LIST_ALL_PIECES, MARINE_INFANTRY_COMPANY_TYPE_ID, MC_12_TYPE_ID, MISSILE_TYPE_ID, MONTAVILLE_ISLAND_ID, NOYARC_ISLAND_ID, NUKE_RANGE, PIECES_WITH_FUEL, RADAR_TYPE_ID, RED_TEAM_ID, REMOTE_SENSING_RANGE, RICO_ISLAND_ID, SAM_SITE_TYPE_ID, SHOR_ISLAND_ID, SOF_TEAM_TYPE_ID, STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID, SUBMARINE_TYPE_ID, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, TAMU_ISLAND_ID, TANK_COMPANY_TYPE_ID, TRANSPORT_TYPE_ID, TYPE_AIR_PIECES, TYPE_FUEL, TYPE_GROUND_PIECES, TYPE_MOVES, VISIBILITY_MATRIX } from '../../constants';
// prettier-ignore
import { AtcScrambleType, BiologicalWeaponsType, BlueOrRedTeamId, GameType, GoldenEyeType, NukeType, PieceType, PlanType, RemoteSensingType } from '../../types';
import { pool } from '../database';
import { Game } from './Game';

/**
 * Represents a row in the pieces database table.
 */
export class Piece implements PieceType {
    pieceId: PieceType['pieceId'];
    pieceGameId: PieceType['pieceGameId'];
    pieceTeamId: PieceType['pieceTeamId'];
    pieceTypeId: PieceType['pieceTypeId'];
    piecePositionId: PieceType['piecePositionId'];
    pieceContainerId: PieceType['pieceContainerId'];
    pieceVisible: PieceType['pieceVisible'];
    pieceMoves: PieceType['pieceMoves'];
    pieceFuel: PieceType['pieceFuel'];
    pieceContents?: PieceType['pieceContents'];
    isPieceDisabled?: PieceType['isPieceDisabled'];

    constructor(pieceId: PieceType['pieceId']) {
        this.pieceId = pieceId;
    }

    /**
     * Gets information from database about this piece.
     */
    async init() {
        let queryString = 'SELECT * FROM pieces WHERE pieceId = ?';
        let inserts = [this.pieceId];
        const [pieceRows] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);

        if (pieceRows.length !== 1) {
            return null;
        }

        Object.assign(this, pieceRows[0]);

        queryString = 'SELECT * FROM goldenEyePieces WHERE pieceId = ?';
        inserts = [this.pieceId];
        const [goldenRows] = await pool.query<RowDataPacket[] & GoldenEyeType[]>(queryString, inserts);

        this.isPieceDisabled = goldenRows.length !== 0;

        return this;
    }

    /**
     * Delete this piece.
     */
    async delete() {
        const queryString = 'DELETE FROM pieces WHERE pieceId = ?';
        const inserts = [this.pieceId];
        await pool.query(queryString, inserts);
    }

    /**
     * Delete the plans for this piece.
     */
    async deletePlans() {
        // TODO: referencing another table, could potentially move this function (maybe)
        const queryString = 'DELETE FROM plans WHERE planPieceId = ?';
        const inserts = [this.pieceId];
        await pool.query(queryString, inserts);
    }

    /**
     * Get the pieces that are within this piece.
     * Pieces become within another by setting pieceContainerId to id of the parent.
     */
    async getPiecesInside() {
        const queryString = 'SELECT * FROM pieces WHERE pieceContainerId = ?';
        const inserts = [this.pieceId];
        const [allPieces] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);
        return allPieces;
    }

    // prettier-ignore
    /**
     * Globally update each piece's visibility based on it's surroundings for this game.
     */
    static async updateVisibilities(gameId: GameType['gameId']) {
        const conn = await pool.getConnection();

        // set all to invisible
        let queryString = 'UPDATE pieces SET pieceVisible = 0 WHERE pieceGameId = ?';
        let inserts = [gameId];
        await conn.query(queryString, inserts);

        // posTypes[teamToUpdate][typeToUpdate] = [...positionsThatThoseTypesAreVisibleOn]
        // TODO: this is bad code, do it the long and hard way or not at all (bug with adding pieces, other constants assume that (could make this array using those constants...))
        const posTypesVisible = [
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]]
        ];

        // These are the only values we are getting from the query
        type SubPieceType = {
            pieceTeamId: PieceType['pieceTeamId'],
            pieceTypeId: PieceType['pieceTypeId'],
            piecePositionId: PieceType['piecePositionId']
        };

        // only need to check distinct pieces, (100 red tanks in same position == 1 red tank in same position)
        queryString = 'SELECT DISTINCT pieceTeamId, pieceTypeId, piecePositionId FROM pieces WHERE pieceGameId = ?';
        inserts = [gameId];
        const [pieces] = await conn.query<RowDataPacket[] & SubPieceType[]>(queryString, inserts);

        let otherTeam;
        for (let x = 0; x < pieces.length; x++) {
            const { pieceTeamId, pieceTypeId, piecePositionId } = pieces[x]; // TODO: pieces inside containers can't see rule?

            for (let type = 0; type < LIST_ALL_PIECES.length; type++) { // check each type
                const currentPieceType = LIST_ALL_PIECES[type];
                if (VISIBILITY_MATRIX[pieceTypeId][currentPieceType] !== -1) { // could it ever see this type?
                    for (let position = 0; position < distanceMatrix[piecePositionId].length; position++) { // for all positions
                        if (distanceMatrix[piecePositionId][position] <= VISIBILITY_MATRIX[pieceTypeId][currentPieceType]) { // is this position in range for that type?
                            otherTeam = pieceTeamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

                            if (!posTypesVisible[otherTeam][type].includes(position)) { // add this position if not already added by another piece somewhere else
                                posTypesVisible[otherTeam][type].push(position);
                            }
                        }
                    }
                }
            }
        }

        // also check remote sensing effects
        queryString = 'SELECT * FROM remoteSensing WHERE gameId = ?';
        inserts = [gameId];
        const [results] = await conn.query<RowDataPacket[] & RemoteSensingType[]>(queryString, inserts);

        // TODO: RemoteSensingType so we can access the values from the query in a safe way (right now it assumes 'any' for .positionId)
        for (let x = 0; x < results.length; x++) {
            const remoteSenseCenter = results[x].positionId;
            for (let currentPos = 0; currentPos < distanceMatrix[remoteSenseCenter].length; currentPos++) {
                if (distanceMatrix[remoteSenseCenter][currentPos] <= REMOTE_SENSING_RANGE) {
                    // put these positions into the posTypesVisible (based on team)
                    const { teamId } = results[x];
                    const otherTeam = teamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;
                    for (let pieceType = 0; pieceType < posTypesVisible[otherTeam].length; pieceType++) {
                        // does not see subs or sof teams
                        // could make a constant for pieces that are excluded from this effect, instead of manually checking each...
                        if (!posTypesVisible[otherTeam][pieceType].includes(currentPos) && pieceType !== SOF_TEAM_TYPE_ID && pieceType !== SUBMARINE_TYPE_ID) { // add this position if not already added by another piece somewhere else
                            posTypesVisible[otherTeam][pieceType].push(currentPos);
                        }
                    }
                }
            }
        }

        // Bulk update for all visibilities
        // TODO: update for radar and missile pieces
        // TODO: change this into something readable? (could also change the double array into a double object...)
        // TODO: change in a way that allows for constant (which pieces are revealed by remote sense...)
        // TODO: change pieceContainerId -1 into a constant and visible into a constant
        queryString = 'UPDATE pieces SET pieceVisible = 1 WHERE pieceGameId = ? AND pieceContainerId = -1 AND ((pieceTeamId = 0 AND pieceTypeId = 0 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 3 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 5 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 6 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 7 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 8 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 9 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 10 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 11 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 12 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 13 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 14 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 16 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 17 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 18 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 20 AND piecePositionId IN (?)) OR (pieceTeamId = 0 AND pieceTypeId = 21 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 0 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 3 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 5 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 6 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 7 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 8 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 9 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 10 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 11 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 12 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 13 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 14 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 16 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 17 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 18 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 20 AND piecePositionId IN (?)) OR (pieceTeamId = 1 AND pieceTypeId = 21 AND piecePositionId IN (?)))';
        const inserts4 = [gameId, posTypesVisible[BLUE_TEAM_ID][BOMBER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][AIR_REFUELING_SQUADRON_ID], posTypesVisible[BLUE_TEAM_ID][TACTICAL_AIRLIFT_SQUADRON_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][AIRBORN_ISR_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][ARMY_INFANTRY_COMPANY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][ARTILLERY_BATTERY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][TANK_COMPANY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][MARINE_INFANTRY_COMPANY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][ATTACK_HELICOPTER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][SAM_SITE_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][DESTROYER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][A_C_CARRIER_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][TRANSPORT_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][MC_12_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][C_130_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][RADAR_TYPE_ID], posTypesVisible[BLUE_TEAM_ID][MISSILE_TYPE_ID], posTypesVisible[RED_TEAM_ID][BOMBER_TYPE_ID], posTypesVisible[RED_TEAM_ID][AIR_REFUELING_SQUADRON_ID], posTypesVisible[RED_TEAM_ID][TACTICAL_AIRLIFT_SQUADRON_TYPE_ID], posTypesVisible[RED_TEAM_ID][AIRBORN_ISR_TYPE_ID], posTypesVisible[RED_TEAM_ID][ARMY_INFANTRY_COMPANY_TYPE_ID], posTypesVisible[RED_TEAM_ID][ARTILLERY_BATTERY_TYPE_ID], posTypesVisible[RED_TEAM_ID][TANK_COMPANY_TYPE_ID], posTypesVisible[RED_TEAM_ID][MARINE_INFANTRY_COMPANY_TYPE_ID], posTypesVisible[RED_TEAM_ID][ATTACK_HELICOPTER_TYPE_ID], posTypesVisible[RED_TEAM_ID][LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID], posTypesVisible[RED_TEAM_ID][SAM_SITE_TYPE_ID], posTypesVisible[RED_TEAM_ID][DESTROYER_TYPE_ID], posTypesVisible[RED_TEAM_ID][A_C_CARRIER_TYPE_ID], posTypesVisible[RED_TEAM_ID][TRANSPORT_TYPE_ID], posTypesVisible[RED_TEAM_ID][MC_12_TYPE_ID], posTypesVisible[RED_TEAM_ID][C_130_TYPE_ID], posTypesVisible[RED_TEAM_ID][RADAR_TYPE_ID], posTypesVisible[RED_TEAM_ID][MISSILE_TYPE_ID]];
        await conn.query(queryString, inserts4);

        conn.release();
    }

    /**
     * Globally move all pieces according to their plans for this game.
     */
    static async move(gameId: GameType['gameId'], movementOrder: PlanType['planMovementOrder']) {
        // movement based on plans (for this order/step)
        const conn = await pool.getConnection();

        const inserts = [gameId, movementOrder];
        const movePiecesQuery =
            'UPDATE pieces, plans SET pieces.piecePositionId = plans.planPositionId, pieces.pieceMoves = pieces.pieceMoves - 1 WHERE pieces.pieceId = plans.planPieceId AND planGameId = ? AND plans.planMovementOrder = ?';
        await conn.query(movePiecesQuery, inserts);

        // update fuel (only for pieces that are restricted by fuel (air pieces))
        const inserts2 = [gameId, movementOrder, TYPE_AIR_PIECES];
        const removeFuel =
            'UPDATE pieces, plans SET pieces.pieceFuel = pieces.pieceFuel - 1 WHERE pieces.pieceId = plans.planPieceId AND planGameId = ? AND plans.planMovementOrder = ? AND pieces.pieceTypeId in (?)';
        await conn.query(removeFuel, inserts2);

        const updateContents =
            'UPDATE pieces AS insidePieces JOIN pieces AS containerPieces ON insidePieces.pieceContainerId = containerPieces.pieceId SET insidePieces.piecePositionId = containerPieces.piecePositionId WHERE insidePieces.pieceGameId = ?';
        const newinserts = [gameId];
        await conn.query(updateContents, newinserts);
        await conn.query(updateContents, newinserts); // do it twice for containers within containers contained pieces to get updated (GENIUS LEVEL CODING RIGHT HERE)

        // TODO: referencing another table here...(could change to put into the plans class)
        const deletePlansQuery = 'DELETE FROM plans WHERE planGameId = ? AND planMovementOrder = ?';
        await conn.query(deletePlansQuery, inserts);

        // handle if the pieces moved into a bio / nuclear place
        let queryString = 'SELECT * FROM biologicalWeapons WHERE gameId = ? AND activated = 1';
        const moreInserts = [gameId];
        const [results] = await conn.query<RowDataPacket[] & BiologicalWeaponsType[]>(queryString, moreInserts);

        // TODO: table / type for bioweapons table to access without positionId assumed any
        const listOfPositions: number[] = [];
        for (let x = 0; x < results.length; x++) {
            // delete the pieces in these positions
            const thisBioWeapon = results[x];
            const { positionId } = thisBioWeapon;
            listOfPositions.push(positionId);
        }

        const nukeQuery = 'SELECT * FROM nukes WHERE gameId = ? AND activated = 1';
        const [moreResults] = await conn.query<RowDataPacket[] & NukeType[]>(nukeQuery, moreInserts);
        for (let x = 0; x < moreResults.length; x++) {
            const { positionId } = moreResults[x];
            for (let y = 0; y < distanceMatrix[positionId].length; y++) {
                if (distanceMatrix[positionId][y] <= NUKE_RANGE) {
                    listOfPositions.push(y);
                }
            }
        }

        // TODO: distinguish between killing ground pieces from bio weapons and all pieces for nukes

        if (listOfPositions.length > 0) {
            queryString = 'DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)';
            const moreInserts2 = [gameId, listOfPositions];
            await conn.query(queryString, moreInserts2);
        }

        conn.release();
    }

    static async deletePlanesWithoutFuel(gameId: GameType['gameId']) {
        // TODO: 0 fuel should possibly be a constant, since it used to be -1 but changed
        const queryString = 'DELETE FROM pieces WHERE pieceGameId = ? AND pieceFuel < 1 AND pieceTypeId in (?)';
        const inserts = [gameId, PIECES_WITH_FUEL];
        await pool.query(queryString, inserts);
    }

    static async giveFuelToHelisOverLand(gameId: GameType['gameId']) {
        const queryString = 'UPDATE pieces SET pieceFuel = ? WHERE pieceGameId = ? AND piecePositionId in (?) AND pieceTypeId = ?';
        const inserts = [TYPE_FUEL[ATTACK_HELICOPTER_TYPE_ID], gameId, ALL_LAND_POSITIONS, ATTACK_HELICOPTER_TYPE_ID];
        await pool.query(queryString, inserts);
    }

    /**
     * Get dictionary of positions and the pieces those positions contain.
     */
    static async getVisiblePieces(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        let queryString =
            'SELECT * FROM pieces WHERE pieceGameId = ? AND (pieceTeamId = ? OR pieceVisible = 1) ORDER BY pieceContainerId, pieceTeamId ASC';
        let inserts = [gameId, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);

        // TODO: dealing with weird datatype with join...
        queryString =
            'SELECT pieceId FROM goldenEyePieces NATURAL JOIN pieces WHERE goldenEyePieces.pieceId = pieces.pieceId AND pieces.pieceGameId = ?';
        inserts = [gameId];
        const [pieceIdsStuck] = await pool.query<RowDataPacket[]>(queryString, inserts);
        const allPieceIdsStuck = [];
        for (let x = 0; x < pieceIdsStuck.length; x++) {
            allPieceIdsStuck.push(pieceIdsStuck[x].pieceId);
        }

        // format for the client state
        const allPieces: { [positionIndex: number]: PieceType[] } = {};
        for (let x = 0; x < results.length; x++) {
            const currentPiece = results[x];
            if (allPieceIdsStuck.includes(currentPiece.pieceId)) {
                currentPiece.isPieceDisabled = true;
            } else {
                currentPiece.isPieceDisabled = false;
            }
            currentPiece.pieceContents = { pieces: [] };
            if (!allPieces[currentPiece.piecePositionId]) {
                allPieces[currentPiece.piecePositionId] = [];
            }
            // TODO: constant instead of -1
            if (currentPiece.pieceContainerId === -1) {
                allPieces[currentPiece.piecePositionId].push(currentPiece);
            } else {
                const indexOfParent = allPieces[currentPiece.piecePositionId].findIndex(
                    (piece: PieceType) => piece.pieceId === currentPiece.pieceContainerId
                );
                if (indexOfParent === -1) {
                    // need to find grandparent, and find parent within pieceContents
                    // loop through all grandparent children to find actual parent?
                    // TODO: probably cleaner way of doing this logic, should also break from outer loop to be more efficient, since we are done
                    for (let x = 0; x < allPieces[currentPiece.piecePositionId].length; x++) {
                        const potentialGrandparent = allPieces[currentPiece.piecePositionId][x];
                        for (let y = 0; y < potentialGrandparent.pieceContents.pieces.length; y++) {
                            const potentialParent = potentialGrandparent.pieceContents.pieces[y];
                            if (potentialParent.pieceId === currentPiece.pieceContainerId) {
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
     */
    static async getPositionRefuels(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        // TODO: constant for 'outside container' instead of -1?
        const queryString =
            'SELECT tnkr.pieceId as tnkrPieceId, tnkr.pieceTypeId as tnkrPieceTypeId, tnkr.piecePositionId as tnkrPiecePositionId, tnkr.pieceMoves as tnkrPieceMoves, tnkr.pieceFuel as tnkrPieceFuel, arcft.pieceId as arcftPieceId, arcft.pieceTypeId as arcftPieceTypeId, arcft.piecePositionId as arcftPiecePositionId, arcft.pieceMoves as arcftPieceMoves, arcft.pieceFuel as arcftPieceFuel FROM (SELECT * FROM pieces WHERE pieceTypeId = 3 AND pieceGameId = ? AND pieceTeamId = ?) as tnkr JOIN (SELECT * FROM pieces WHERE pieceTypeId in (0, 1, 2, 4, 5, 17, 18) AND pieceGameId = ? AND pieceTeamId = ?) as arcft ON tnkr.piecePositionId = arcft.piecePositionId WHERE arcft.pieceContainerId = -1';
        const inserts = [gameId, gameTeam, gameId, gameTeam];
        const [results] = await pool.query<RowDataPacket[]>(queryString, inserts); // TODO: weird data type with query

        // TODO: should deal with results here and return with other things, or do entire function in this method... calling the other bulk inserts and stuff available?
        // TODO: need a type for this
        return results as any;
    }

    /**
     * Put 1 piece inside another container piece.
     */
    static async putInsideContainer(selectedPiece: PieceType, containerPiece: PieceType) {
        // TODO: could combine into 1 query, or could have a selection for variable query, 1 request instead of 2 would be better

        let queryString = 'UPDATE pieces SET pieceContainerId = ?, piecePositionId = ? WHERE pieceId = ?';
        let inserts = [containerPiece.pieceId, containerPiece.piecePositionId, selectedPiece.pieceId];
        await pool.query(queryString, inserts);

        // refuel the piece
        if (TYPE_AIR_PIECES.includes(selectedPiece.pieceTypeId)) {
            queryString = 'UPDATE pieces SET pieceFuel = ? WHERE pieceId = ?';
            inserts = [TYPE_FUEL[selectedPiece.pieceTypeId], selectedPiece.pieceId];
            await pool.query(queryString, inserts);
        }
    }

    // TODO: could make this a non-static method? (since we already have the pieceId....)
    /**
     * Put 1 piece outside of it's parent piece.
     */
    static async putOutsideContainer(selectedPieceId: PieceType['pieceId'], newPositionId: number) {
        // TODO: deal with inner transport pieces (need to also set the piecePositionId)
        const queryString = 'UPDATE pieces SET pieceContainerId = -1, piecePositionId = ? WHERE pieceId = ?';
        const inserts = [newPositionId, selectedPieceId];
        await pool.query(queryString, inserts);
    }

    // TODO: change this into a pieceConstructor Object, bad practice to have so many parameters
    /**
     * Insert a single piece into the database for this game's team.
     */
    static async insert(
        pieceGameId: PieceType['pieceGameId'],
        pieceTeamId: PieceType['pieceTeamId'],
        pieceTypeId: PieceType['pieceTypeId'],
        piecePositionId: PieceType['piecePositionId'],
        pieceContainerId: PieceType['pieceContainerId'],
        pieceVisible: PieceType['pieceVisible'],
        pieceMoves: PieceType['pieceMoves'],
        pieceFuel: PieceType['pieceFuel']
    ) {
        const queryString =
            'INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const inserts = [pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel];
        const [results] = await pool.query<OkPacket>(queryString, inserts);
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
     */
    static async resetMoves(gameId: GameType['gameId']) {
        const testquery =
            'UPDATE pieces SET pieceMoves = CASE WHEN pieceTypeId = 0 THEN ? WHEN pieceTypeId = 1 THEN ? WHEN pieceTypeId = 2 THEN ? WHEN pieceTypeId = 3 THEN ? WHEN pieceTypeId = 4 THEN ? WHEN pieceTypeId = 5 THEN ? WHEN pieceTypeId = 6 THEN ? WHEN pieceTypeId = 7 THEN ? WHEN pieceTypeId = 8 THEN ? WHEN pieceTypeId = 9 THEN ? WHEN pieceTypeId = 10 THEN ? WHEN pieceTypeId = 11 THEN ? WHEN pieceTypeId = 12 THEN ? WHEN pieceTypeId = 13 THEN ? WHEN pieceTypeId = 14 THEN ? WHEN pieceTypeId = 15 THEN ? WHEN pieceTypeId = 16 THEN ? WHEN pieceTypeId = 17 THEN ? WHEN pieceTypeId = 18 THEN ? WHEN pieceTypeId = 19 THEN ? END WHERE pieceGameId = ?';
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

    /**
     * Removing fuel from pieces that don't have any plans (and already have some amount of fuel (not -1))
     */
    static async removeFuelForLoitering(gameId: GameType['gameId']) {
        // TODO: don't remove fuel for planes over airfields? (or cover it with another refuel call)
        const queryString =
            'UPDATE pieces LEFT JOIN plans ON pieceId = planPieceId SET pieceFuel = pieceFuel - 1 WHERE planPieceId IS NULL AND pieceFuel != -1 AND pieceGameId = 1;';
        const inserts = [gameId];
        await pool.query(queryString, inserts);
    }

    static async refuelPlanesOverAirfields(game: Game) {
        // planes (piece type) over airfield positions, and the plane's team has to own the airfield
        // TODO: probably a good, efficient way of doing this
        const atcQuery = 'SELECT * FROM atcScramble WHERE gameId = ? AND activated = ?';
        const atcInserts = [game.gameId, ACTIVATED];
        const [atcResults] = await pool.query<RowDataPacket[] & AtcScrambleType[]>(atcQuery, atcInserts);

        const confirmedAtcScramble = [];
        for (let x = 0; x < atcResults.length; x++) {
            confirmedAtcScramble.push(atcResults[x].positionId);
        }

        const testquery =
            'UPDATE pieces SET pieceFuel = CASE WHEN pieceTypeId = 0 THEN ? WHEN pieceTypeId = 1 THEN ? WHEN pieceTypeId = 2 THEN ? WHEN pieceTypeId = 3 THEN ? WHEN pieceTypeId = 4 THEN ? WHEN pieceTypeId = 5 THEN ? WHEN pieceTypeId = 17 THEN ? WHEN pieceTypeId = 18 THEN ? END WHERE pieceGameId = ? AND piecePositionId = ? AND pieceTeamId = ?';

        for (let x = 0; x < ALL_AIRFIELD_LOCATIONS.length; x++) {
            // skip airfields that are disabled
            if (confirmedAtcScramble.includes(ALL_AIRFIELD_LOCATIONS[x])) continue;

            const inserts = [
                TYPE_FUEL[0],
                TYPE_FUEL[1],
                TYPE_FUEL[2],
                TYPE_FUEL[3],
                TYPE_FUEL[4],
                TYPE_FUEL[5],
                TYPE_FUEL[17],
                TYPE_FUEL[18],
                game.gameId,
                ALL_AIRFIELD_LOCATIONS[x],
                game[`airfield${x}`]
            ];
            await pool.query(testquery, inserts);
        }
    }

    static async ableToPlaceRadar(thisGame: Game, gameTeam: PieceType['pieceTeamId'], selectedPositionId: number) {
        // TODO: could make this into 1 request instead of 2
        const queryString = 'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND piecePositionId = ? AND pieceTypeId in (?)';
        const inserts = [thisGame.gameId, gameTeam, selectedPositionId, TYPE_GROUND_PIECES];
        const [results] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);

        // At least 1 friendly ground piece is there
        if (results.length === 0) {
            return false;
        }

        // TODO: should we consider the difference between hidden pieces and visible pieces affecting the placement (placing pieces next to each other when not knowing about it is weird)
        const queryString2 = 'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND piecePositionId = ?';
        const inserts2 = [thisGame.gameId, gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID, selectedPositionId];
        const [results2] = await pool.query<RowDataPacket[] & PieceType[]>(queryString2, inserts2);

        if (results2.length !== 0) {
            return false;
        }

        let completelyOwnsIsland = false;
        let islandNum = -1;

        const allKeys = Object.keys(ISLAND_POSITIONS);
        for (let x = 0; x < allKeys.length; x++) {
            const currentKey = parseInt(allKeys[x]);
            const thisIslandPositions = ISLAND_POSITIONS[currentKey];
            if (thisIslandPositions.includes(selectedPositionId)) {
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
        }

        return completelyOwnsIsland;
    }

    static async ableToPlaceMissile(thisGame: Game, gameTeam: PieceType['pieceTeamId'], selectedPositionId: number) {
        // what are the rules for placement with missiles (does it need to have friendly pieces there?)

        // TODO: could make this into 1 request instead of 2
        const queryString = 'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND piecePositionId = ? AND pieceTypeId = ?';
        const inserts = [thisGame.gameId, gameTeam, selectedPositionId, MISSILE_TYPE_ID];
        const [results] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);

        // At most 0 missiles
        if (results.length !== 0) {
            return false;
        }

        // check for enemies in the hex
        // TODO: should we consider the difference between hidden pieces and visible pieces affecting the placement (placing pieces next to each other when not knowing about it is weird)
        const queryString2 = 'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND piecePositionId = ?';
        const inserts2 = [thisGame.gameId, gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID, selectedPositionId];
        const [results2] = await pool.query<RowDataPacket[] & PieceType[]>(queryString2, inserts2);

        if (results2.length !== 0) {
            return false;
        }

        // need to check position is a missile silo and they completely own the island...
        let completelyOwnsIsland = false;
        let islandNum = -1;

        const allKeys = Object.keys(ISLAND_POSITIONS);
        for (let x = 0; x < allKeys.length; x++) {
            const currentKey = parseInt(allKeys[x]);
            const thisIslandPositions = ISLAND_POSITIONS[currentKey];
            if (thisIslandPositions.includes(selectedPositionId)) {
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
        }

        return completelyOwnsIsland;
    }

    static async samFire(thisGame: Game) {
        // need to try and hit planes within range for sams
        // different ranges / visibilities
        // all the same chance hit?
        // prioritize closer things, but still random which one is hit?
        // don't hit 'landed' planes when they are over airfields they control...

        // TODO: a lot of this could be refactored (could use sub functions to make it cleaner...)

        // TODO: this is a very expensive operation, consider possible refactors----look into selecting all pieces from the game (maybe specific selection) and just looping through it (less requests, but bigger data)
        // keeping it expensive for simplicity for now

        const samQuery = 'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTypeId = ?';
        const samInserts = [thisGame.gameId, SAM_SITE_TYPE_ID];
        const [samResults] = await pool.query<RowDataPacket[] & PieceType[]>(samQuery, samInserts);

        const listOfDeletedPieces: PieceType[] = [];

        // for each sam
        // TODO: we know all the sam positions, therefore we can figure out all possible enemy positions, and do a combined network request for all enemies in all those positions
        // ^^^^ logic below would still work cause it's still checking distance matrix for priority, and any outside will be skipped.... (list of range for each piece still needs to happen....)
        for (let x = 0; x < samResults.length; x++) {
            const thisSam = samResults[x];

            // what positions are within range?
            const listOfInRangePositions = [];
            for (let z = 0; z < distanceMatrix[thisSam.piecePositionId].length; z++) {
                if (
                    distanceMatrix[thisSam.piecePositionId][z] === 0 ||
                    distanceMatrix[thisSam.piecePositionId][z] === 1 ||
                    distanceMatrix[thisSam.piecePositionId][z] === 2 ||
                    distanceMatrix[thisSam.piecePositionId][z] === 3
                ) {
                    listOfInRangePositions.push(z);
                }
            }

            // find the area around the sam that it could target...
            // TODO: make a constant for visible / invisible values (1, 0)
            const queryString =
                'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId IN (?) AND piecePositionId IN (?) AND pieceVisible = 1';
            const inserts = [
                thisGame.gameId,
                thisSam.pieceTeamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID,
                PIECES_WITH_FUEL,
                listOfInRangePositions
            ];
            const [enemyPlanes] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts); // TODO: bad to do queries within for loop.....(more reason to just accept bigger data, fewer requests... (or find a sql trick (unlikely)))

            const listOfRange0Enemies = [];
            const listOfRange1Enemies = [];
            const listOfRange2Enemies = [];
            const listOfRange3Enemies = [];

            for (let b = 0; b < enemyPlanes.length; b++) {
                const thisEnemyPlane = enemyPlanes[b];
                // duplicate code here and below..
                if (distanceMatrix[thisSam.piecePositionId][thisEnemyPlane.piecePositionId] === 0) {
                    if (ALL_AIRFIELD_LOCATIONS.includes(thisEnemyPlane.piecePositionId)) {
                        const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(thisEnemyPlane.piecePositionId);
                        const airfieldOwner = thisGame[`airfield${airfieldNum}`];
                        if (airfieldOwner !== thisEnemyPlane.pieceTeamId) {
                            listOfRange0Enemies.push(thisEnemyPlane);
                        }
                    } else {
                        // not over an airfield
                        listOfRange0Enemies.push(thisEnemyPlane);
                    }
                } else if (distanceMatrix[thisSam.piecePositionId][thisEnemyPlane.piecePositionId] === 1) {
                    // don't add if over it's own airfield
                    if (ALL_AIRFIELD_LOCATIONS.includes(thisEnemyPlane.piecePositionId)) {
                        const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(thisEnemyPlane.piecePositionId);
                        const airfieldOwner = thisGame[`airfield${airfieldNum}`];
                        if (airfieldOwner !== thisEnemyPlane.pieceTeamId) {
                            listOfRange1Enemies.push(thisEnemyPlane);
                        }
                    } else {
                        // not over an airfield
                        listOfRange1Enemies.push(thisEnemyPlane);
                    }
                } else if (
                    distanceMatrix[thisSam.piecePositionId][thisEnemyPlane.piecePositionId] === 2 &&
                    ![STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID].includes(thisEnemyPlane.pieceTypeId)
                ) {
                    if (ALL_AIRFIELD_LOCATIONS.includes(thisEnemyPlane.piecePositionId)) {
                        const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(thisEnemyPlane.piecePositionId);
                        const airfieldOwner = thisGame[`airfield${airfieldNum}`];
                        if (airfieldOwner !== thisEnemyPlane.pieceTeamId) {
                            listOfRange2Enemies.push(thisEnemyPlane);
                        }
                    } else {
                        listOfRange2Enemies.push(thisEnemyPlane);
                    }
                } else if (
                    distanceMatrix[thisSam.piecePositionId][thisEnemyPlane.piecePositionId] === 3 &&
                    ![STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID].includes(thisEnemyPlane.pieceTypeId)
                ) {
                    if (ALL_AIRFIELD_LOCATIONS.includes(thisEnemyPlane.piecePositionId)) {
                        const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(thisEnemyPlane.piecePositionId);
                        const airfieldOwner = thisGame[`airfield${airfieldNum}`];
                        if (airfieldOwner !== thisEnemyPlane.pieceTeamId) {
                            listOfRange3Enemies.push(thisEnemyPlane);
                        }
                    } else {
                        listOfRange3Enemies.push(thisEnemyPlane);
                    }
                }
            }

            // first check things that are within range 1? (skip range 0 due to battles already handling it)
            if (listOfRange0Enemies.length !== 0) {
                // pick a random enemy in this list to hit with x chance
                const randomIndex = Math.floor(Math.random() * listOfRange0Enemies.length);
                const randomEnemy = listOfRange0Enemies[randomIndex];
                const randomChance = Math.floor(Math.random() * 100) + 1;
                if (randomChance < 75) {
                    // need to delete the piece
                    listOfDeletedPieces.push(randomEnemy);
                }
            } else if (listOfRange1Enemies.length !== 0) {
                // pick a random enemy in this list to hit with x chance
                const randomIndex = Math.floor(Math.random() * listOfRange1Enemies.length);
                const randomEnemy = listOfRange1Enemies[randomIndex];
                const randomChance = Math.floor(Math.random() * 100) + 1;
                if (randomChance < 50) {
                    // need to delete the piece
                    listOfDeletedPieces.push(randomEnemy);
                }
            } else if (listOfRange2Enemies.length !== 0) {
                // pick a random enemy in this list to hit with x chance
                const randomIndex = Math.floor(Math.random() * listOfRange2Enemies.length);
                const randomEnemy = listOfRange2Enemies[randomIndex];
                const randomChance = Math.floor(Math.random() * 100) + 1;
                if (randomChance < 25) {
                    // need to delete the piece
                    listOfDeletedPieces.push(randomEnemy);
                }
            } else if (listOfRange3Enemies.length !== 0) {
                // pick a random enemy in this list to hit with x chance
                const randomIndex = Math.floor(Math.random() * listOfRange3Enemies.length);
                const randomEnemy = listOfRange3Enemies[randomIndex];
                const randomChance = Math.floor(Math.random() * 100) + 1;
                if (randomChance < 13) {
                    // TODO: better constants and refactoring, but should make it clear that at range 3 it's half the attack value
                    // need to delete the piece
                    listOfDeletedPieces.push(randomEnemy);
                }
            }
        }

        if (listOfDeletedPieces.length !== 0) {
            const listOfDeletedPieceIds: PieceType['pieceId'][] = [];
            for (const deletedPiece of listOfDeletedPieces) {
                if (!listOfDeletedPieceIds.includes(deletedPiece.pieceId)) {
                    listOfDeletedPieceIds.push(deletedPiece.pieceId);
                }
            }
            const deleteQuery = 'DELETE FROM pieces WHERE pieceId IN (?)';
            const deleteInserts = [listOfDeletedPieceIds];
            await pool.query(deleteQuery, deleteInserts);
        }

        return listOfDeletedPieces;
    }
}
