import { OkPacket, RowDataPacket } from 'mysql2/promise';
import { ANTI_SAT_MISSILE_ROUNDS, BLUE_TEAM_ID, RED_TEAM_ID } from '../../../constants';
import { AntiSatMissileType, BlueOrRedTeamId, GameType, RemoteSensingType } from '../../../types';
import { pool } from '../../database';
import { Piece } from '../Piece';

export const insertAntiSat = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    const queryString = 'INSERT INTO antiSatMissiles (gameId, teamId, roundsLeft) VALUES (?, ?, ?)';
    const inserts = [gameId, gameTeam, ANTI_SAT_MISSILE_ROUNDS];
    const [results] = await pool.query<OkPacket>(queryString, inserts);
    return results.insertId;
};

export const getAntiSat = async (gameId: GameType['gameId'], teamId: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM antiSatMissiles WHERE gameId = ? AND teamId = ?';
    const inserts = [gameId, teamId];
    const [results] = await pool.query<RowDataPacket[] & AntiSatMissileType[]>(queryString, inserts);

    const confirmedAntiSat = [];

    for (let x = 0; x < results.length; x++) {
        const thisAntiSat = results[x];
        const { roundsLeft } = thisAntiSat;
        confirmedAntiSat.push(roundsLeft);
    }

    return confirmedAntiSat;
};

export const checkRemoteSensingHit = async (
    gameId: GameType['gameId'],
    teamId: typeof RED_TEAM_ID | typeof BLUE_TEAM_ID,
    remoteSensingId: RemoteSensingType['remoteSensingId'],
    remoteSensingPosId: number
) => {
    // team requesting this just put up an anti sat, check for enemy remote sensing to kill (and report killed to teams)
    const otherTeamId = teamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

    const queryString = 'SELECT * FROM antiSatMissiles WHERE gameId = ? AND teamId = ? ORDER BY roundsLeft ASC LIMIT 1';
    const inserts = [gameId, otherTeamId];
    const [results] = await pool.query<RowDataPacket[] & AntiSatMissileType[]>(queryString, inserts);

    if (results.length > 0) {
        // delete the remote sensing
        // assume only got 1 (LIMIT 1)
        const { antiSatId } = results[0];
        const deleteQuery = 'DELETE FROM remoteSensing WHERE remoteSensingId = ?';
        const deleteInserts = [remoteSensingId];
        await pool.query(deleteQuery, deleteInserts);

        const deleteQuery2 = 'DELETE FROM antiSatMissiles WHERE antiSatId = ?';
        const deleteInserts2 = [antiSatId];
        await pool.query(deleteQuery2, deleteInserts2);

        await Piece.updateVisibilities(gameId);

        return remoteSensingPosId;
    }

    return -1;
};

export const checkAntiSatHit = async (gameId: GameType['gameId'], teamId: typeof BLUE_TEAM_ID | typeof RED_TEAM_ID, antiSatId: number) => {
    // team requesting this just put up an anti sat, check for enemy remote sensing to kill (and report killed to teams)
    const otherTeamId = teamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

    const queryString = 'SELECT * FROM remoteSensing WHERE gameId = ? AND teamId = ? ORDER BY roundsLeft ASC, remoteSensingId ASC LIMIT 1';
    const inserts = [gameId, otherTeamId];
    const [results] = await pool.query<RowDataPacket[] & RemoteSensingType[]>(queryString, inserts);

    if (results.length > 0) {
        // delete the remote sensing
        // assume only got 1 (LIMIT 1)
        const { remoteSensingId, positionId } = results[0];
        const deleteQuery = 'DELETE FROM remoteSensing WHERE remoteSensingId = ?';
        const deleteInserts = [remoteSensingId];
        await pool.query(deleteQuery, deleteInserts);

        const deleteQuery2 = 'DELETE FROM antiSatMissiles WHERE antiSatId = ?';
        const deleteInserts2 = [antiSatId];
        await pool.query(deleteQuery2, deleteInserts2);

        await Piece.updateVisibilities(gameId);

        return positionId;
    }

    return -1;
};

export const decreaseAntiSat = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE antiSatMissiles SET roundsLeft = roundsLeft - 1 WHERE gameId = ?';
    const inserts = [gameId];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM antiSatMissiles WHERE roundsLeft = 0';
    await pool.query(queryString);
};
