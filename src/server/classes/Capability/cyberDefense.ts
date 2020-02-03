import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
import { ACTIVATED, CYBER_DOMINANCE_ROUNDS, BLUE_TEAM_ID, RED_TEAM_ID, DEACTIVATED } from '../../../constants';
import { CyberDefenseType, GameType } from '../../../types';

export const getCyberDefense = async (gameId: GameType['gameId'], gameTeam: number) => {
    const queryString = 'SELECT * FROM cyberDefenses WHERE gameId = ? AND teamId = ?';
    const inserts = [gameId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & CyberDefenseType[]>(queryString, inserts);

    return results.length !== 0;
};

export const useCyberDefense = async (gameId: GameType['gameId']) => {
    const queryString = 'SELECT * FROM cyberDefenses WHERE gameId = ?';
    const inserts = [gameId];
    const [results] = await pool.query<RowDataPacket[] & CyberDefenseType[]>(queryString, inserts);

    // need to delete things based on the cyber defense
    const teamsAffected = [];
    for (let x = 0; x < results.length; x++) {
        teamsAffected.push(results[x].teamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID);
    }

    if (teamsAffected.length === 0) {
        return;
    }

    let deleteQuery = 'DELETE FROM atcScramble WHERE gameId = ? AND teamId in (?) AND activated = ?';
    const deleteInserts = [gameId, teamsAffected, DEACTIVATED];
    await pool.query(deleteQuery, deleteInserts);

    deleteQuery = 'DELETE FROM missileDisrupts WHERE gameId = ? AND teamId in (?) AND activated = ?';
    await pool.query(deleteQuery, deleteInserts);

    deleteQuery = 'DELETE FROM commInterrupt WHERE gameId = ? AND teamId in (?) AND activated = ?';
    await pool.query(deleteQuery, deleteInserts);
};

export const insertCyberDefense = async (gameId: GameType['gameId'], gameTeam: number) => {
    const insertQuery = 'SELECT * FROM cyberDefenses WHERE gameId = ? AND teamId = ?';
    const inserts = [gameId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & CyberDefenseType[]>(insertQuery, inserts);

    if (results.length !== 0) {
        return false;
    }

    const queryString = 'INSERT INTO cyberDefenses (gameId, teamId, roundsLeft) VALUES (? ,?, ?)';
    const preparedInserts = [gameId, gameTeam, CYBER_DOMINANCE_ROUNDS];
    await pool.query(queryString, preparedInserts);

    return true;
};

export const decreaseCyberDefense = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE cyberDefenses SET roundsLeft = roundsLeft - 1 WHERE gameId = ?';
    const inserts = [gameId, ACTIVATED];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM cyberDefenses WHERE roundsLeft = 0';
    await pool.query(queryString);
};
