import { RowDataPacket } from 'mysql2/promise';
import { Piece, pool } from '../../';
import { ATTACK_HELICOPTER_TYPE_ID, DRONE_SWARM_ROUNDS, LIST_ALL_AIRFIELD_PIECES } from '../../../constants';
import { DroneSwarmType, GameType, BlueOrRedTeamId } from '../../../types';

export const getDroneSwarms = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId): Promise<number[]> => {
    const queryString = 'SELECT * FROM droneSwarms WHERE gameId = ? AND gameTeam = ?';
    const inserts = [gameId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & DroneSwarmType[]>(queryString, inserts);

    const listOfDroneSwarms = [];
    for (let x = 0; x < results.length; x++) {
        listOfDroneSwarms.push(results[x].positionId);
    }

    return listOfDroneSwarms;
};

export const insertDroneSwarm = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) => {
    const insertQuery = 'SELECT * FROM droneSwarms WHERE gameId = ? AND positionId = ? AND gameTeam = ?';
    const inserts = [gameId, selectedPositionId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & DroneSwarmType[]>(insertQuery, inserts);

    if (results.length !== 0) {
        return false;
    }

    const queryString = 'INSERT INTO droneSwarms (gameId, gameTeam, positionId, roundsLeft) VALUES (? ,?, ?, ?)';
    const preparedInserts = [gameId, gameTeam, selectedPositionId, DRONE_SWARM_ROUNDS];
    await pool.query(queryString, preparedInserts);

    return true;
};

export const checkDroneSwarmHit = async (gameId: GameType['gameId']): Promise<number[]> => {
    const queryString =
        'SELECT droneSwarmId, pieceId, positionId FROM droneSwarms INNER JOIN plans ON positionId = planPositionId INNER JOIN pieces ON planPieceId = pieceId WHERE pieceGameId = ? AND pieceTypeId in (?)';
    const inserts = [gameId, [...LIST_ALL_AIRFIELD_PIECES, ATTACK_HELICOPTER_TYPE_ID]];
    type QueryResult = {
        droneSwarmId: number;
        pieceId: number;
        positionId: number;
    };
    const [results] = await pool.query<RowDataPacket[] & QueryResult[]>(queryString, inserts);

    if (results.length !== 0) {
        // delete the piece and try again
        const pieceToDelete = await new Piece(results[0].pieceId).init();
        pieceToDelete.delete();

        const queryString = 'DELETE FROM droneSwarms WHERE droneSwarmId = ?';
        const inserts = [results[0].droneSwarmId];
        await pool.query(queryString, inserts);

        const arrayOfPos = await checkDroneSwarmHit(gameId); // TODO: probably a better way instead of recursive, but makes sense here since we keep calling it until results.length == 0
        arrayOfPos.push(results[0].positionId);
        return arrayOfPos;
    }

    return []; // base case
};

export const decreaseDroneSwarms = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE droneSwarms SET roundsLeft = roundsLeft - 1 WHERE gameId = ?';
    const inserts = [gameId];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM droneSwarms WHERE roundsLeft = 0';
    await pool.query(queryString);
};
