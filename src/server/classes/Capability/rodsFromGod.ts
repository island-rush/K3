import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
import { LIST_ALL_POSITIONS_TYPE } from '../../../constants';
import { BlueOrRedTeamId, GameType, RodsFromGodType } from '../../../types';

export const rodsFromGodInsert = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: LIST_ALL_POSITIONS_TYPE) => {
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
};

export const getRodsFromGod = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM rodsFromGod WHERE gameId = ? AND teamId = ?';
    const inserts = [gameId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & RodsFromGodType[]>(queryString, inserts);

    const listOfPositions: LIST_ALL_POSITIONS_TYPE[] = [];
    for (let x = 0; x < results.length; x++) {
        listOfPositions.push(results[x].positionId);
    }

    return listOfPositions;
};

export const useRodsFromGod = async (gameId: GameType['gameId']) => {
    let queryString = 'SELECT * FROM rodsFromGod WHERE gameId = ?';
    let inserts = [gameId];
    const [results] = await pool.query<RowDataPacket[] & RodsFromGodType[]>(queryString, inserts);

    if (results.length === 0) {
        return [];
    }

    // need the positions anyway to give back to the clients for updating
    const fullListOfPositions: LIST_ALL_POSITIONS_TYPE[] = [];
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
};
