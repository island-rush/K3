import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
import { ACTIVATED, DEACTIVATED, MISSILE_LAUNCH_DISRUPTION_ROUNDS } from '../../../constants';
import { MissileDisruptType, GameType, BlueOrRedTeamId } from '../../../types';
import { Piece } from '../Piece';

/**
 * Returns list of missile ids that are known to be disrupted at this time.
 */
export const getMissileDisrupt = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM missileDisrupts WHERE gameId = ? AND (teamId = ? OR activated = ?)';
    const inserts = [gameId, gameTeam, ACTIVATED];
    const [results] = await pool.query<RowDataPacket[] & MissileDisruptType[]>(queryString, inserts);

    const listOfMissileDisrupt = [];
    for (let x = 0; x < results.length; x++) {
        listOfMissileDisrupt.push(results[x].missileId);
    }

    return listOfMissileDisrupt;
};

export const insertMissileDisrupt = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPiece: Piece) => {
    const insertQuery = 'SELECT * FROM missileDisrupts WHERE gameId = ? AND missileId = ? AND (teamId = ? OR activated = ?)';
    const inserts = [gameId, selectedPiece.pieceId, gameTeam, ACTIVATED];
    const [results] = await pool.query<RowDataPacket[] & MissileDisruptType[]>(insertQuery, inserts);

    if (results.length !== 0) {
        return false;
    }

    const queryString = 'INSERT INTO missileDisrupts (gameId, missileId, roundsLeft, teamId, activated) VALUES (? ,?, ?, ?, ?)';
    const preparedInserts = [gameId, selectedPiece.pieceId, MISSILE_LAUNCH_DISRUPTION_ROUNDS, gameTeam, DEACTIVATED];
    await pool.query(queryString, preparedInserts);

    return true;
};

export const decreaseMissileDisrupt = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE missileDisrupts SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = ?';
    const inserts = [gameId, ACTIVATED];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM missileDisrupts WHERE roundsLeft = 0';
    await pool.query(queryString);
};

export const useMissileDisrupt = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE missileDisrupts SET activated = ? WHERE gameId = ?';
    let inserts = [ACTIVATED, gameId];
    await pool.query(queryString, inserts);

    queryString = 'SELECT * FROM missileDisrupts WHERE gameId = ?';
    inserts = [gameId];
    const [results] = await pool.query<RowDataPacket[] & MissileDisruptType[]>(queryString, inserts);

    const listOfMissileDisrupt = [];
    for (let x = 0; x < results.length; x++) {
        listOfMissileDisrupt.push(results[x].missileId);
    }

    return listOfMissileDisrupt;
};
