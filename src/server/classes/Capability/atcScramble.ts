import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
import { ACTIVATED, ATC_SCRAMBLE_ROUNDS, DEACTIVATED } from '../../../constants';
import { AtcScrambleType, BlueOrRedTeamId, GameType } from '../../../types';

export const getAtcScramble = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM atcScramble WHERE gameId = ? AND (teamId = ? OR activated = ?)';
    const inserts = [gameId, gameTeam, ACTIVATED];
    const [results] = await pool.query<RowDataPacket[] & AtcScrambleType[]>(queryString, inserts);

    const listOfAtcScramble = [];
    for (let x = 0; x < results.length; x++) {
        listOfAtcScramble.push(results[x].positionId);
    }

    return listOfAtcScramble;
};

export const insertAtcScramble = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) => {
    const insertQuery = 'SELECT * FROM atcScramble WHERE gameId = ? AND positionId = ? AND (teamId = ? OR activated = ?)';
    const inserts = [gameId, selectedPositionId, gameTeam, ACTIVATED];
    const [results] = await pool.query<RowDataPacket[] & AtcScrambleType[]>(insertQuery, inserts);

    if (results.length !== 0) {
        return false;
    }

    const queryString = 'INSERT INTO atcScramble (gameId, positionId, roundsLeft, teamId, activated) VALUES (? ,?, ?, ?, ?)';
    const preparedInserts = [gameId, selectedPositionId, ATC_SCRAMBLE_ROUNDS, gameTeam, DEACTIVATED];
    await pool.query(queryString, preparedInserts);

    return true;
};

export const decreaseAtcScramble = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE atcScramble SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = ?';
    const inserts = [gameId, ACTIVATED];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM atcScramble WHERE roundsLeft = 0';
    await pool.query(queryString);
};

export const useAtcScramble = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE atcScramble SET activated = ? WHERE gameId = ?';
    let inserts = [ACTIVATED, gameId];
    await pool.query(queryString, inserts);

    queryString = 'SELECT * FROM atcScramble WHERE gameId = ?';
    inserts = [gameId];
    const [allAtcScramble] = await pool.query<RowDataPacket[] & AtcScrambleType[]>(queryString, inserts);

    const listPositions = [];
    for (let x = 0; x < allAtcScramble.length; x++) {
        listPositions.push(allAtcScramble[x].positionId);
    }

    return listPositions;
};
