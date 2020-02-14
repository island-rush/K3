import { BlueOrRedTeamId, PieceType, GameType } from '../../../types';
import { pool } from '../../database';

export const bulkUpdatePieceFuels = async (
    fuelUpdates: { pieceId: PieceType['pieceId']; piecePositionId: PieceType['piecePositionId']; newFuel: PieceType['pieceFuel'] }[],
    gameId: GameType['gameId'],
    gameTeam: BlueOrRedTeamId
) => {
    if (fuelUpdates.length === 0) {
        return;
    }

    const allInserts = [];
    for (let x = 0; x < fuelUpdates.length; x++) {
        const { pieceId, newFuel } = fuelUpdates[x]; // assuming this is what is inside of it, should probably check
        const newInsert = [pieceId, gameId, gameTeam, newFuel];
        allInserts.push(newInsert);
    }

    let queryString = 'INSERT INTO pieceRefuelTemp (pieceId, gameId, teamId, newFuel) VALUES ?';
    const inserts = [allInserts];
    await pool.query(queryString, inserts);

    queryString =
        'UPDATE pieces, pieceRefuelTemp SET pieces.pieceFuel = pieceRefuelTemp.newFuel WHERE pieces.pieceId = pieceRefuelTemp.pieceId AND pieces.pieceTeamId = pieceRefuelTemp.teamId';
    await pool.query(queryString);

    queryString = 'DELETE FROM pieceRefuelTemp WHERE gameId = ? AND teamId = ?';
    const inserts2 = [gameId, gameTeam];
    await pool.query(queryString, inserts2);
};
