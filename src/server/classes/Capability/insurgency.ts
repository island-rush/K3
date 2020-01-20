import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
import { BLUE_TEAM_ID, RED_TEAM_ID } from '../../../constants';
import { InsurgencyType, PieceType } from '../../../types';

// TODO: better naming convention for these methods
export const insurgencyInsert = async (gameId: number, gameTeam: number, selectedPositionId: number) => {
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
};

export const getInsurgency = async (gameId: number, gameTeam: number) => {
    const queryString = 'SELECT * FROM insurgency WHERE gameId = ? AND teamId = ?';
    const inserts = [gameId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & InsurgencyType[]>(queryString, inserts);

    const listOfPositions = [];
    for (let x = 0; x < results.length; x++) {
        listOfPositions.push(results[x].positionId);
    }

    return listOfPositions;
};

export const useInsurgency = async (gameId: number) => {
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
};
