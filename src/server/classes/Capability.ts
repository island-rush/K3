// prettier-ignore
import { RowDataPacket } from 'mysql2/promise';
// prettier-ignore
import { ACTIVATED, BIO_WEAPONS_ROUNDS, BLUE_TEAM_ID, COMM_INTERRUPT_RANGE, COMM_INTERRUPT_ROUNDS, DEACTIVATED, distanceMatrix, GOLDEN_EYE_RANGE, GOLDEN_EYE_ROUNDS, RAISE_MORALE_ROUNDS, RED_TEAM_ID, REMOTE_SENSING_ROUNDS, TYPE_AIR, TYPE_AIR_PIECES, TYPE_GROUND_PIECES, TYPE_LAND, TYPE_OWNERS, TYPE_SEA, TYPE_SPECIAL } from '../../constants';
import {
    BiologicalWeaponsType,
    InsurgencyType,
    PieceType,
    RemoteSensingType,
    RodsFromGodType,
    RaiseMoraleType,
    CommInterruptType,
    GoldenEyeType
} from '../../types';
import { pool } from '../database';

/**
 * List of static functions for handling capabilities.
 */
export class Capability {
    static async rodsFromGodInsert(gameId: number, gameTeam: number, selectedPositionId: number) {
        // TODO: this could be 1 query if efficient and do something with UNIQUE or INSERT IGNORE or REPLACE
        let queryString = 'SELECT * FROM rodsFromGod WHERE gameId = ? AND teamId = ? AND positionId = ?';
        const inserts = [gameId, gameTeam, selectedPositionId];
        const [results] = await pool.query<RowDataPacket[] & RodsFromGodType[]>(queryString, inserts);

        // prevent duplicate entries if possible
        if (results.length !== 0) {
            return false;
        }

        queryString = 'INSERT INTO rodsFromGod (gameId, teamId, positionId) VALUES (?, ?, ?)';
        await pool.query(queryString, inserts);
        return true;
    }

    static async getRodsFromGod(gameId: number, gameTeam: number) {
        const queryString = 'SELECT * FROM rodsFromGod WHERE gameId = ? AND teamId = ?';
        const inserts = [gameId, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & RodsFromGodType[]>(queryString, inserts);

        const listOfPositions = [];
        for (let x = 0; x < results.length; x++) {
            listOfPositions.push(results[x].positionId);
        }

        return listOfPositions;
    }

    static async useRodsFromGod(gameId: number) {
        let queryString = 'SELECT * FROM rodsFromGod WHERE gameId = ?';
        let inserts = [gameId];
        const [results] = await pool.query<RowDataPacket[] & RodsFromGodType[]>(queryString, inserts);

        if (results.length === 0) {
            return [];
        }

        // need the positions anyway to give back to the clients for updating
        const fullListOfPositions = [];
        for (let x = 0; x < results.length; x++) {
            fullListOfPositions.push(results[x].positionId);
        }

        // now delete pieces with this position
        queryString = 'DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)';
        const inserts2 = [gameId, fullListOfPositions];
        await pool.query(queryString, inserts2);

        // delete the rodsFromGod in the db
        queryString = 'DELETE FROM rodsFromGod WHERE gameId = ?';
        inserts = [gameId];
        await pool.query(queryString, inserts);

        return fullListOfPositions;
    }

    // TODO: better naming convention for these methods
    static async insurgencyInsert(gameId: number, gameTeam: number, selectedPositionId: number) {
        // TODO: this could be 1 query if efficient and do something with UNIQUE or INSERT IGNORE or REPLACE
        let queryString = 'SELECT * FROM insurgency WHERE gameId = ? AND teamId = ? AND positionId = ?';
        const inserts = [gameId, gameTeam, selectedPositionId];
        const [results] = await pool.query<RowDataPacket[] & InsurgencyType[]>(queryString, inserts);

        // prevent duplicate entries if possible
        if (results.length !== 0) {
            return false;
        }

        queryString = 'INSERT INTO insurgency (gameId, teamId, positionId) VALUES (?, ?, ?)';
        await pool.query(queryString, inserts);
        return true;
    }

    static async getInsurgency(gameId: number, gameTeam: number) {
        const queryString = 'SELECT * FROM insurgency WHERE gameId = ? AND teamId = ?';
        const inserts = [gameId, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & InsurgencyType[]>(queryString, inserts);

        const listOfPositions = [];
        for (let x = 0; x < results.length; x++) {
            listOfPositions.push(results[x].positionId);
        }

        return listOfPositions;
    }

    static async useInsurgency(gameId: number) {
        let queryString = 'SELECT * FROM insurgency WHERE gameId = ?';
        let inserts = [gameId];
        const [results] = await pool.query<RowDataPacket[] & InsurgencyType[]>(queryString, inserts);

        // TODO: make this more efficient using bulk selects/updates/deletes

        const listOfPiecesToKill: any = [];
        const listOfPieceIdsToKill: any = [];
        const listOfEffectedPositions: any = [];

        if (results.length === 0) {
            return { listOfPiecesToKill, listOfEffectedPositions };
        }

        // for each insurgency
        for (let x = 0; x < results.length; x++) {
            const { teamId, positionId } = results[x];
            listOfEffectedPositions.push(positionId);
            const otherTeam = teamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

            queryString = 'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND piecePositionId = ?';
            inserts = [gameId, otherTeam, positionId];
            const [pieceResults] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);

            // for each piece
            for (let y = 0; y < pieceResults.length; y++) {
                const thisPiece = pieceResults[y];
                const { pieceId } = thisPiece;
                // TODO: refactor to use constant to calculate the random chance (use a percentage?) in case this chance needs to be changed later (./gameConstants)
                const randomChance = Math.floor(Math.random() * 3) + 1;
                // randomChance is either 1, 2, or 3
                if (randomChance === 2) {
                    listOfPieceIdsToKill.push(pieceId);
                    listOfPiecesToKill.push(thisPiece);
                }
            }
        }

        if (listOfPieceIdsToKill.length > 0) {
            queryString = 'DELETE FROM pieces WHERE pieceId in (?)';
            inserts = [listOfPieceIdsToKill];
            await pool.query(queryString, inserts);
        }

        queryString = 'DELETE FROM insurgency WHERE gameId = ?';
        inserts = [gameId];
        await pool.query(queryString, inserts);

        return { listOfPiecesToKill, listOfEffectedPositions };
    }

    static async remoteSensingInsert(gameId: number, gameTeam: number, selectedPositionId: number) {
        let queryString = 'SELECT * FROM remoteSensing WHERE gameId = ? AND teamId = ? AND positionId = ?';
        let inserts = [gameId, gameTeam, selectedPositionId];
        const [results] = await pool.query<RowDataPacket[] & RemoteSensingType[]>(queryString, inserts);

        // prevent duplicate entries if possible
        if (results.length !== 0) {
            return false;
        }

        queryString = 'INSERT INTO remoteSensing (gameId, teamId, positionId, roundsLeft) VALUES (?, ?, ?, ?)';
        inserts = [gameId, gameTeam, selectedPositionId, REMOTE_SENSING_ROUNDS];
        await pool.query(queryString, inserts);
        return true;
    }

    static async getRemoteSensing(gameId: number, gameTeam: number) {
        const queryString = 'SELECT * FROM remoteSensing WHERE gameId = ? AND teamId = ?';
        const inserts = [gameId, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & RemoteSensingType[]>(queryString, inserts);

        const listOfPositions = [];
        for (let x = 0; x < results.length; x++) {
            listOfPositions.push(results[x].positionId);
        }

        return listOfPositions;
    }

    static async decreaseRemoteSensing(gameId: number) {
        // TODO: probably a more efficient way of doing this (single request...)
        let queryString = 'UPDATE remoteSensing SET roundsLeft = roundsLeft - 1 WHERE gameId = ?;';
        const inserts = [gameId];
        await pool.query(queryString, inserts);

        queryString = 'DELETE FROM remoteSensing WHERE roundsLeft = 0';
        await pool.query(queryString);
    }

    static async insertBiologicalWeapons(gameId: number, gameTeam: number, selectedPositionId: number) {
        // TODO: Humanitarian assistance is restricted for the duration of this effect.
        let queryString = 'SELECT * FROM biologicalWeapons WHERE gameId = ? AND teamId = ? AND positionId = ?';
        let inserts = [gameId, gameTeam, selectedPositionId];
        const [results] = await pool.query<RowDataPacket[] & BiologicalWeaponsType[]>(queryString, inserts);

        // prevent duplicate entries if possible
        if (results.length !== 0) {
            return false;
        }

        queryString = 'INSERT INTO biologicalWeapons (gameId, teamId, positionId, roundsLeft, activated) VALUES (?, ?, ?, ?, ?)';
        inserts = [gameId, gameTeam, selectedPositionId, BIO_WEAPONS_ROUNDS, DEACTIVATED];
        await pool.query(queryString, inserts);
        return true;
    }

    static async getBiologicalWeapons(gameId: number, gameTeam: number) {
        // get this team's bio weapons, and all team's activated bio weapons
        // what positions are currently toxic (planned to be toxic?)
        // happens in the same timeframe as rods from god, but sticks around...could be complicated with separating from plannedBio and activeBio
        // probably keep the same for now, keep it simple and upgrade it later. Since upgrading is easy due to good organize functions now.

        const queryString = 'SELECT * FROM biologicalWeapons WHERE gameId = ? AND (activated = ? OR teamId = ?)';
        const inserts = [gameId, ACTIVATED, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & BiologicalWeaponsType[]>(queryString, inserts);

        const listOfPositions = [];
        for (let x = 0; x < results.length; x++) {
            listOfPositions.push(results[x].positionId);
        }

        return listOfPositions;
    }

    static async useBiologicalWeapons(gameId: number) {
        let queryString = 'UPDATE biologicalWeapons SET activated = ? WHERE gameId = ?';
        let inserts = [ACTIVATED, gameId];
        await pool.query(queryString, inserts);

        queryString = 'SELECT * FROM biologicalWeapons WHERE gameId = ?'; // all should be activated, no need to specify
        inserts = [gameId];
        const [results] = await pool.query<RowDataPacket[] & BiologicalWeaponsType[]>(queryString, inserts);

        if (results.length === 0) {
            return [];
        }

        // need the positions anyway to give back to the clients for updating
        const fullListOfPositions: any = [];
        for (let x = 0; x < results.length; x++) {
            fullListOfPositions.push(results[x].positionId);
        }

        if (fullListOfPositions.length > 0) {
            // now delete pieces with this position
            // TODO: " (does not include aircraft (that are taken off))"
            queryString = 'DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)';
            inserts = [gameId, fullListOfPositions];
            await pool.query(queryString, inserts);
        }

        return fullListOfPositions;
    }

    static async decreaseBiologicalWeapons(gameId: number) {
        let queryString = 'UPDATE biologicalWeapons SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = ?';
        const inserts = [gameId, ACTIVATED];
        await pool.query(queryString, inserts);

        queryString = 'DELETE FROM biologicalWeapons WHERE roundsLeft = 0';
        await pool.query(queryString);
    }

    static async insertRaiseMorale(gameId: number, gameTeam: number, selectedCommanderType: number) {
        let queryString = 'SELECT * FROM raiseMorale WHERE gameId = ? AND teamId = ? AND commanderType = ?';
        let inserts = [gameId, gameTeam, selectedCommanderType];
        const [results] = await pool.query<RowDataPacket[] & RaiseMoraleType[]>(queryString, inserts);

        // prevent duplicate entries if possible
        if (results.length !== 0) {
            return false;
        }

        queryString = 'INSERT INTO raiseMorale (gameId, teamId, commanderType, roundsLeft) VALUES (?, ?, ?, ?)';
        inserts = [gameId, gameTeam, selectedCommanderType, RAISE_MORALE_ROUNDS - 1]; // -1 because already executing for the current round
        await pool.query(queryString, inserts);

        queryString = 'UPDATE pieces SET pieceMoves = pieceMoves + 1 WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId in (?)';
        const inserts2 = [gameId, gameTeam, TYPE_OWNERS[selectedCommanderType]];
        await pool.query(queryString, inserts2);

        return true;
    }

    static async decreaseRaiseMorale(gameId: number) {
        const conn = await pool.getConnection();

        let queryString = 'DELETE FROM raiseMorale WHERE roundsLeft = 0';
        await conn.query(queryString);

        queryString = 'UPDATE raiseMorale SET roundsLeft = roundsLeft - 1 WHERE gameId = ?';
        let inserts = [gameId];
        await conn.query(queryString, inserts);

        queryString = 'SELECT * from raiseMorale WHERE gameId = ?';
        const [results] = await conn.query<RowDataPacket[] & RaiseMoraleType[]>(queryString, inserts);

        // TODO: probably cleaner way of putting this (more explicit with constants...)
        const updateArrays: any = [
            { 1: 0, 2: 0, 3: 0, 4: 0 },
            { 1: 0, 2: 0, 3: 0, 4: 0 }
        ];

        for (let x = 0; x < results.length; x++) {
            const thisRaiseMorale = results[x];
            const { teamId, commanderType } = thisRaiseMorale;
            updateArrays[teamId][commanderType]++;
        }

        // TODO: do this in 1 statement instead of several (should allow multiple queries in single prepared statement (bulk but would work...(also more efficient if 1 query (but bigger / more complex?))))
        queryString = 'UPDATE pieces SET pieceMoves = pieceMoves + ? WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId in (?)';

        inserts = [updateArrays[BLUE_TEAM_ID][TYPE_AIR], gameId, BLUE_TEAM_ID, TYPE_OWNERS[TYPE_AIR]];
        await conn.query(queryString, inserts);

        inserts = [updateArrays[BLUE_TEAM_ID][TYPE_LAND], gameId, BLUE_TEAM_ID, TYPE_OWNERS[TYPE_LAND]];
        await conn.query(queryString, inserts);

        inserts = [updateArrays[BLUE_TEAM_ID][TYPE_SEA], gameId, BLUE_TEAM_ID, TYPE_OWNERS[TYPE_SEA]];
        await conn.query(queryString, inserts);

        inserts = [updateArrays[BLUE_TEAM_ID][TYPE_SPECIAL], gameId, BLUE_TEAM_ID, TYPE_OWNERS[TYPE_SPECIAL]];
        await conn.query(queryString, inserts);

        inserts = [updateArrays[RED_TEAM_ID][TYPE_AIR], gameId, RED_TEAM_ID, TYPE_OWNERS[TYPE_AIR]];
        await conn.query(queryString, inserts);

        inserts = [updateArrays[RED_TEAM_ID][TYPE_LAND], gameId, RED_TEAM_ID, TYPE_OWNERS[TYPE_LAND]];
        await conn.query(queryString, inserts);

        inserts = [updateArrays[RED_TEAM_ID][TYPE_SEA], gameId, RED_TEAM_ID, TYPE_OWNERS[TYPE_SEA]];
        await conn.query(queryString, inserts);

        inserts = [updateArrays[RED_TEAM_ID][TYPE_SPECIAL], gameId, RED_TEAM_ID, TYPE_OWNERS[TYPE_SPECIAL]];
        await conn.query(queryString, inserts);

        conn.release();
    }

    static async getRaiseMorale(gameId: number, gameTeam: number) {
        // TODO: handle more than 1 raise morale for double boosting (how would this look like when letting client know (object? / array?))
        const queryString = 'SELECT * FROM raiseMorale WHERE gameId = ?';
        const inserts = [gameId, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & RaiseMoraleType[]>(queryString, inserts);

        const listOfCommandersBoosted = [];
        for (let x = 0; x < results.length; x++) {
            listOfCommandersBoosted.push(results[x].commanderType);
        }

        return listOfCommandersBoosted;
    }

    static async insertCommInterrupt(gameId: number, gameTeam: number, selectedPositionId: number) {
        let queryString = 'SELECT * FROM commInterrupt WHERE gameId = ? AND teamId = ? AND positionId = ?';
        let inserts = [gameId, gameTeam, selectedPositionId];
        const [results] = await pool.query<RowDataPacket[] & CommInterruptType[]>(queryString, inserts);

        // prevent duplicate entries if possible
        if (results.length !== 0) {
            return false;
        }

        queryString = 'INSERT INTO commInterrupt (gameId, teamId, positionId, roundsLeft, activated) VALUES (?, ?, ?, ?, ?)';
        inserts = [gameId, gameTeam, selectedPositionId, COMM_INTERRUPT_ROUNDS, DEACTIVATED];
        await pool.query(queryString, inserts);
        return true;
    }

    static async getCommInterrupt(gameId: number, gameTeam: number) {
        const queryString = 'SELECT * FROM commInterrupt WHERE gameId = ? AND (activated = ? OR teamId = ?)';
        const inserts = [gameId, ACTIVATED, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & CommInterruptType[]>(queryString, inserts);

        const listOfCommInterrupt = [];
        for (let x = 0; x < results.length; x++) {
            listOfCommInterrupt.push(results[x].positionId);
        }

        return listOfCommInterrupt;
    }

    static async useCommInterrupt(gameId: number) {
        // take inactivated comm interrupt and activate them, let clients know which positions are disrupted
        let queryString = 'UPDATE commInterrupt SET activated = ? WHERE gameId = ?';
        let inserts = [ACTIVATED, gameId];
        await pool.query(queryString, inserts);

        queryString = 'SELECT * FROM commInterrupt WHERE gameId = ?'; // all should be activated, no need to specify
        inserts = [gameId];
        const [results] = await pool.query<RowDataPacket[] & CommInterruptType[]>(queryString, inserts);

        if (results.length === 0) {
            return [];
        }

        // need the positions anyway to give back to the clients for updating
        const fullListOfPositions0 = [];
        const fullListOfPositions1 = [];
        const masterListOfAllPositions = [];
        for (let x = 0; x < results.length; x++) {
            const thisResult = results[x];
            const { positionId, teamId } = thisResult;
            if (teamId === 0) {
                fullListOfPositions0.push(positionId);
            } else {
                fullListOfPositions1.push(positionId);
            }
            masterListOfAllPositions.push(positionId);
        }

        const positionsInTheseRanges0: number[] = [];
        for (let y = 0; y < fullListOfPositions0.length; y++) {
            const currentCenterPosition = fullListOfPositions0[y];
            for (let z = 0; z < distanceMatrix[currentCenterPosition].length; z++) {
                if (distanceMatrix[currentCenterPosition][z] <= COMM_INTERRUPT_RANGE) {
                    positionsInTheseRanges0.push(z);
                }
            }
        }
        const positionsInTheseRanges1: number[] = [];
        for (let y = 0; y < fullListOfPositions1.length; y++) {
            const currentCenterPosition = fullListOfPositions1[y];
            for (let z = 0; z < distanceMatrix[currentCenterPosition].length; z++) {
                if (distanceMatrix[currentCenterPosition][z] <= COMM_INTERRUPT_RANGE) {
                    positionsInTheseRanges1.push(z);
                }
            }
        }

        queryString =
            'DELETE FROM plans WHERE planPieceId IN (SELECT pieceId FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND piecePositionId in (?))';
        if (positionsInTheseRanges0.length > 0) {
            const inserts = [gameId, 0, positionsInTheseRanges0];
            await pool.query(queryString, inserts);
        }
        if (positionsInTheseRanges1.length > 0) {
            const inserts = [gameId, 1, positionsInTheseRanges1];
            await pool.query(queryString, inserts);
        }

        return masterListOfAllPositions;
    }

    static async decreaseCommInterrupt(gameId: any) {
        let queryString = 'UPDATE commInterrupt SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = ?';
        const inserts = [gameId, ACTIVATED];
        await pool.query(queryString, inserts);

        queryString = 'DELETE FROM commInterrupt WHERE roundsLeft = 0';
        await pool.query(queryString);
    }

    static async getGoldenEye(gameId: any, gameTeam: any) {
        const queryString = 'SELECT * FROM goldenEye WHERE gameId = ? AND (activated = ? OR teamId = ?)';
        const inserts = [gameId, ACTIVATED, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & GoldenEyeType[]>(queryString, inserts);

        const listOfGoldenEye = [];
        for (let x = 0; x < results.length; x++) {
            listOfGoldenEye.push(results[x].positionId);
        }

        return listOfGoldenEye;
    }

    static async insertGoldenEye(gameId: number, gameTeam: number, selectedPositionId: number) {
        let queryString = 'SELECT * FROM goldenEye WHERE gameId = ? AND teamId = ? AND positionId = ?';
        let inserts = [gameId, gameTeam, selectedPositionId];
        const [results] = await pool.query<RowDataPacket[] & GoldenEyeType[]>(queryString, inserts);

        // prevent duplicate entries if possible
        if (results.length !== 0) {
            return false;
        }

        queryString = 'INSERT INTO goldenEye (gameId, teamId, positionId, roundsLeft, activated) VALUES (?, ?, ?, ?, ?)';
        inserts = [gameId, gameTeam, selectedPositionId, GOLDEN_EYE_ROUNDS, DEACTIVATED];
        await pool.query(queryString, inserts);
        return true;
    }

    // TODO: could use more bulk sql statements for better efficiency (future task, efficient enough for now)
    static async useGoldenEye(gameId: number) {
        let queryString = 'UPDATE goldenEye SET activated = ? WHERE gameId = ?';
        let inserts = [ACTIVATED, gameId];
        await pool.query(queryString, inserts);

        queryString = 'SELECT * FROM goldenEye WHERE gameId = ?';
        inserts = [gameId];
        const [allGoldenEye] = await pool.query<RowDataPacket[] & GoldenEyeType[]>(queryString, inserts);

        if (allGoldenEye.length === 0) {
            return [];
        }

        const listOfEffectedPositions = [];

        for (let x = 0; x < allGoldenEye.length; x++) {
            const thisGoldenEye = allGoldenEye[x];
            const { goldenEyeId, teamId, positionId, roundsLeft } = thisGoldenEye;

            listOfEffectedPositions.push(positionId);

            const otherTeam = teamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

            // roundsLeft === 9 -> first time executing, need to delete the pieces
            if (roundsLeft === GOLDEN_EYE_ROUNDS) {
                const allEffectedPositions = [];
                for (let y = 0; y < distanceMatrix[positionId].length; y++) {
                    if (distanceMatrix[positionId][y] <= GOLDEN_EYE_RANGE) {
                        allEffectedPositions.push(y);
                    }
                }

                // delete air pieces
                queryString = 'DELETE FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId in (?) AND piecePositionId in (?)';
                const inserts2 = [gameId, otherTeam, TYPE_AIR_PIECES, allEffectedPositions];
                await pool.query(queryString, inserts2);

                // insert ground pieces into goldenEyePieces
                queryString =
                    'INSERT INTO goldenEyePieces SELECT ?, pieceId FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId in (?) AND piecePositionId in (?)';
                const inserts = [goldenEyeId, gameId, otherTeam, TYPE_GROUND_PIECES, allEffectedPositions];
                await pool.query(queryString, inserts);
            }
        }

        // delete plans from pieces that are in goldenEyePieces
        queryString =
            'DELETE FROM plans WHERE planPieceId in (SELECT p.pieceId FROM pieces AS p NATURAL JOIN goldenEye AS ge NATURAL JOIN goldenEyePieces AS gep WHERE ge.goldenEyeId = gep.goldenEyeId AND gep.pieceId = p.pieceId AND ge.gameId = ?)';
        inserts = [gameId];
        await pool.query(queryString, inserts);

        return listOfEffectedPositions;
    }

    static async decreaseGoldenEye(gameId: number) {
        let queryString = 'UPDATE goldenEye SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = ?';
        const inserts = [gameId, ACTIVATED];
        await pool.query(queryString, inserts);

        queryString = 'DELETE FROM goldenEye WHERE roundsLeft = 0';
        await pool.query(queryString);
    }
}
