import { RowDataPacket } from 'mysql2';
import { pool } from '../../';
// prettier-ignore
import { ACTIVATED, BLUE_TEAM_ID, DEACTIVATED, distanceMatrix, GOLDEN_EYE_RANGE, GOLDEN_EYE_ROUNDS, RED_TEAM_ID, TYPE_AIR_PIECES, TYPE_GROUND_PIECES } from '../../../constants';
import { GoldenEyeType } from '../../../types';

export const getGoldenEye = async (gameId: any, gameTeam: any) => {
    const queryString = 'SELECT * FROM goldenEye WHERE gameId = ? AND (activated = ? OR teamId = ?)';
    const inserts = [gameId, ACTIVATED, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & GoldenEyeType[]>(queryString, inserts);

    const listOfGoldenEye = [];
    for (let x = 0; x < results.length; x++) {
        listOfGoldenEye.push(results[x].positionId);
    }

    return listOfGoldenEye;
};

export const insertGoldenEye = async (gameId: number, gameTeam: number, selectedPositionId: number) => {
    let queryString = 'SELECT * FROM goldenEye WHERE gameId = ? AND teamId = ? AND positionId = ?';
    let inserts = [gameId, gameTeam, selectedPositionId];
    const [results] = await pool.query<RowDataPacket[] & GoldenEyeType[]>(queryString, inserts);

    // prevent duplicate entries if possible
    if (results.length !== 0) {
        return false;
    }

    queryString = 'INSERT INTO goldenEye (gameId, teamId, positionId, roundsLeft, activated) VALUES (?, ?, ?, ?, ?)';
    inserts = [gameId, gameTeam, selectedPositionId, GOLDEN_EYE_ROUNDS, DEACTIVATED];
    await pool.query(queryString, inserts);
    return true;
};

// TODO: could use more bulk sql statements for better efficiency (future task, efficient enough for now)
export const useGoldenEye = async (gameId: number) => {
    let queryString = 'UPDATE goldenEye SET activated = ? WHERE gameId = ?';
    let inserts = [ACTIVATED, gameId];
    await pool.query(queryString, inserts);

    queryString = 'SELECT * FROM goldenEye WHERE gameId = ?';
    inserts = [gameId];
    const [allGoldenEye] = await pool.query<RowDataPacket[] & GoldenEyeType[]>(queryString, inserts);

    if (allGoldenEye.length === 0) {
        return [];
    }

    const listOfEffectedPositions = [];

    for (let x = 0; x < allGoldenEye.length; x++) {
        const thisGoldenEye = allGoldenEye[x];
        const { goldenEyeId, teamId, positionId, roundsLeft } = thisGoldenEye;

        listOfEffectedPositions.push(positionId);

        const otherTeam = teamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

        // roundsLeft === 9 -> first time executing, need to delete the pieces
        if (roundsLeft === GOLDEN_EYE_ROUNDS) {
            const allEffectedPositions = [];
            for (let y = 0; y < distanceMatrix[positionId].length; y++) {
                if (distanceMatrix[positionId][y] <= GOLDEN_EYE_RANGE) {
                    allEffectedPositions.push(y);
                }
            }

            // delete air pieces
            queryString = 'DELETE FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId in (?) AND piecePositionId in (?)';
            const inserts2 = [gameId, otherTeam, TYPE_AIR_PIECES, allEffectedPositions];
            await pool.query(queryString, inserts2);

            // insert ground pieces into goldenEyePieces
            queryString =
                'INSERT INTO goldenEyePieces SELECT ?, pieceId FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId in (?) AND piecePositionId in (?)';
            const inserts = [goldenEyeId, gameId, otherTeam, TYPE_GROUND_PIECES, allEffectedPositions];
            await pool.query(queryString, inserts);
        }
    }

    // delete plans from pieces that are in goldenEyePieces
    queryString =
        'DELETE FROM plans WHERE planPieceId in (SELECT p.pieceId FROM pieces AS p NATURAL JOIN goldenEye AS ge NATURAL JOIN goldenEyePieces AS gep WHERE ge.goldenEyeId = gep.goldenEyeId AND gep.pieceId = p.pieceId AND ge.gameId = ?)';
    inserts = [gameId];
    await pool.query(queryString, inserts);

    return listOfEffectedPositions;
};

export const decreaseGoldenEye = async (gameId: number) => {
    let queryString = 'UPDATE goldenEye SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = ?';
    const inserts = [gameId, ACTIVATED];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM goldenEye WHERE roundsLeft = 0';
    await pool.query(queryString);
};
