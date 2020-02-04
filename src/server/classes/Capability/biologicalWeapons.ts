import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
import { ACTIVATED, BIO_WEAPONS_ROUNDS, DEACTIVATED, LIST_ALL_POSITIONS_TYPE } from '../../../constants';
import { BiologicalWeaponsType, BlueOrRedTeamId, GameType } from '../../../types';

export const insertBiologicalWeapons = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: LIST_ALL_POSITIONS_TYPE) => {
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
};

export const getBiologicalWeapons = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    // get this team's bio weapons, and all team's activated bio weapons
    // what positions are currently toxic (planned to be toxic?)
    // happens in the same timeframe as rods from god, but sticks around...could be complicated with separating from plannedBio and activeBio
    // probably keep the same for now, keep it simple and upgrade it later. Since upgrading is easy due to good organize functions now.

    const queryString = 'SELECT * FROM biologicalWeapons WHERE gameId = ? AND (activated = ? OR teamId = ?)';
    const inserts = [gameId, ACTIVATED, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & BiologicalWeaponsType[]>(queryString, inserts);

    const listOfPositions: LIST_ALL_POSITIONS_TYPE[] = [];
    for (let x = 0; x < results.length; x++) {
        listOfPositions.push(results[x].positionId);
    }

    return listOfPositions;
};

export const useBiologicalWeapons = async (gameId: GameType['gameId']) => {
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
    const fullListOfPositions: LIST_ALL_POSITIONS_TYPE[] = [];
    for (let x = 0; x < results.length; x++) {
        fullListOfPositions.push(results[x].positionId);
    }

    if (fullListOfPositions.length > 0) {
        // now delete pieces with this position
        // TODO: " (does not include aircraft (that are taken off))"
        queryString = 'DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)';
        const inserts = [gameId, fullListOfPositions];
        await pool.query(queryString, inserts);
    }

    return fullListOfPositions;
};

export const decreaseBiologicalWeapons = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE biologicalWeapons SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = ?';
    const inserts = [gameId, ACTIVATED];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM biologicalWeapons WHERE roundsLeft = 0';
    await pool.query(queryString);
};
