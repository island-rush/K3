import { RowDataPacket } from 'mysql2/promise';
import { Piece, pool } from '../../';
import { TYPE_OWNERS, TYPE_SEA } from '../../../constants';
import { SeaMineType, GameType, BlueOrRedTeamId, PieceType } from '../../../types';

export const insertSeaMine = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) => {
    // TODO: could make it unique within the database by doing double primary key, instead of single key id, other database tricks and best practices
    let queryString = 'SELECT * FROM seaMines WHERE gameId = ? AND positionId = ? AND gameTeam = ?';
    let inserts = [gameId, selectedPositionId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & SeaMineType[]>(queryString, inserts);

    // prevent duplicate entries if possible
    if (results.length !== 0) {
        return false;
    }

    queryString = 'INSERT INTO seaMines (gameId, gameTeam, positionId) VALUES (?, ?, ?)';
    inserts = [gameId, gameTeam, selectedPositionId];
    await pool.query(queryString, inserts);
    return true;
};

export const getSeaMines = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM seaMines WHERE gameId = ? AND gameTeam = ?';
    const inserts = [gameId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & SeaMineType[]>(queryString, inserts);

    const listOfSeaMines = [];
    for (let x = 0; x < results.length; x++) {
        listOfSeaMines.push(results[x].positionId);
    }

    return listOfSeaMines;
};

export const checkSeaMineHit = async (gameId: GameType['gameId']): Promise<number[]> => {
    const queryString =
        'SELECT seaMineId, pieceId, positionId FROM seaMines INNER JOIN plans ON positionId = planPositionId INNER JOIN pieces ON planPieceId = pieceId WHERE pieceGameId = ? AND pieceTypeId in (?)';
    const inserts = [gameId, TYPE_OWNERS[TYPE_SEA]];
    type QueryResult = {
        seaMineId: SeaMineType['seaMineId'];
        pieceId: PieceType['pieceId'];
        positionId: number;
    };
    const [results] = await pool.query<RowDataPacket[] & QueryResult[]>(queryString, inserts);

    if (results.length !== 0) {
        // delete the piece and try again
        const pieceToDelete = await new Piece(results[0].pieceId).init();
        pieceToDelete.delete();

        const queryString = 'DELETE FROM seaMines WHERE seaMineId = ?';
        const inserts = [results[0].seaMineId];
        await pool.query(queryString, inserts);

        const arrayOfPos = await checkSeaMineHit(gameId); // TODO: probably a better way instead of recursive, but makes sense here since we keep calling it until results.length == 0
        arrayOfPos.push(results[0].positionId);
        return arrayOfPos;
    }

    return []; // base case
};
