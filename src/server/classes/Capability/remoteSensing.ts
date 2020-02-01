import { RowDataPacket, OkPacket } from 'mysql2/promise';
import { pool } from '../../';
import { REMOTE_SENSING_ROUNDS } from '../../../constants';
import { RemoteSensingType, GameType } from '../../../types';

export const remoteSensingInsert = async (gameId: GameType['gameId'], gameTeam: number, selectedPositionId: number) => {
    let queryString = 'SELECT * FROM remoteSensing WHERE gameId = ? AND teamId = ? AND positionId = ?';
    let inserts = [gameId, gameTeam, selectedPositionId];
    const [results] = await pool.query<RowDataPacket[] & RemoteSensingType[]>(queryString, inserts);

    // prevent duplicate entries if possible
    if (results.length !== 0) {
        return false;
    }

    queryString = 'INSERT INTO remoteSensing (gameId, teamId, positionId, roundsLeft) VALUES (?, ?, ?, ?)';
    inserts = [gameId, gameTeam, selectedPositionId, REMOTE_SENSING_ROUNDS];
    const [results2] = await pool.query<OkPacket>(queryString, inserts);
    return results2.insertId;
};

export const getRemoteSensing = async (gameId: GameType['gameId'], gameTeam: number) => {
    const queryString = 'SELECT * FROM remoteSensing WHERE gameId = ? AND teamId = ?';
    const inserts = [gameId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & RemoteSensingType[]>(queryString, inserts);

    const listOfPositions = [];
    for (let x = 0; x < results.length; x++) {
        listOfPositions.push(results[x].positionId);
    }

    return listOfPositions;
};

export const decreaseRemoteSensing = async (gameId: GameType['gameId']) => {
    // TODO: probably a more efficient way of doing this (single request...)
    let queryString = 'UPDATE remoteSensing SET roundsLeft = roundsLeft - 1 WHERE gameId = ?;';
    const inserts = [gameId];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM remoteSensing WHERE roundsLeft = 0';
    await pool.query(queryString);
};
