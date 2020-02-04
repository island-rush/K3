import { RowDataPacket } from 'mysql2/promise';
import { DESTROYER_ATTACK_RANGE_CHANCE, distanceMatrix } from '../../../constants';
import { BlueOrRedTeamId, BombardmentType, CapabilitiesState, GameType, PieceType } from '../../../types';
import { pool } from '../../database';
import { Piece } from '../Piece';

export const insertBombardmentAttack = async (gameId: GameType['gameId'], destroyerPiece: Piece, targetPiece: Piece) => {
    // assume we know everything is setup by bombardmentConfirm (pieces exist, within range...)

    const queryString = 'SELECT * FROM bombardments WHERE gameId = ? AND destroyerId = ?';
    const inserts = [gameId, destroyerPiece.pieceId];
    const [results] = await pool.query<RowDataPacket[] & BombardmentType[]>(queryString, inserts);

    // prevent duplicate entries if possible (already have an attack for this destroyer)
    if (results.length !== 0) {
        return false;
    }

    const insertQuery = 'INSERT INTO bombardments (gameId, teamId, destroyerId, targetId) VALUES (?, ?, ?, ?)';
    const insertInserts = [gameId, destroyerPiece.pieceTeamId, destroyerPiece.pieceId, targetPiece.pieceId];
    await pool.query(insertQuery, insertInserts);
    return true;
};

export const getBombardmentAttack = async (gameId: GameType['gameId'], teamId: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM bombardments WHERE gameId = ? AND teamId = ?';
    const inserts = [gameId, teamId];
    const [results] = await pool.query<RowDataPacket[] & BombardmentType[]>(queryString, inserts);

    const confirmedBombardments: CapabilitiesState['confirmedBombardments'] = [];

    for (let x = 0; x < results.length; x++) {
        const thisBombardment = results[x];
        confirmedBombardments.push({
            destroyerId: thisBombardment.destroyerId,
            targetId: thisBombardment.targetId
        });
    }

    return confirmedBombardments;
};

export const useBombardmentAttack = async (gameId: GameType['gameId']) => {
    // go through each attack and return the 'results' of the attack or which positions to highlight?

    // start with big join selection that grabs all piece data (mostly just the target piece typeId / position to calculate hit %)
    const queryString =
        'SELECT a.pieceId as targetId, a.pieceTypeId as targetTypeId, a.piecePositionId as targetPositionId, b.piecePositionId as destroyerPositionId FROM bombardments JOIN pieces a ON targetId = a.pieceId JOIN pieces b ON destroyerId = b.pieceId WHERE gameId = ?';
    const inserts = [gameId];

    type QueryResultType = {
        targetId: PieceType['pieceId'];
        targetPositionId: PieceType['piecePositionId'];
        targetTypeId: PieceType['pieceTypeId'];
        destroyerPositionId: PieceType['piecePositionId'];
    };

    const [results] = await pool.query<RowDataPacket[] & QueryResultType[]>(queryString, inserts);

    const listOfTargetsToDelete = [];
    const listOfPositionsHit = [];

    for (let x = 0; x < results.length; x++) {
        const { targetId, targetPositionId, destroyerPositionId } = results[x];
        // TODO: consider type as part of bombardment?
        // type is also part of the query, but not used here (yet)
        const distance = distanceMatrix[destroyerPositionId][targetPositionId];
        let percentHit: number;

        if (!DESTROYER_ATTACK_RANGE_CHANCE[distance]) {
            percentHit = 0;
        } else {
            percentHit = DESTROYER_ATTACK_RANGE_CHANCE[distance];
        }

        const randomNumber = Math.floor(Math.random() * 100) + 1;
        if (randomNumber <= percentHit) {
            listOfTargetsToDelete.push(targetId);
            listOfPositionsHit.push(targetPositionId);
        }
    }

    if (listOfTargetsToDelete.length > 0) {
        const deleteQuery = 'DELETE FROM pieces WHERE pieceId in (?)';
        const deleteInserts = [listOfTargetsToDelete];
        await pool.query(deleteQuery, deleteInserts);
    }

    if (results.length > 0) {
        const deleteAll = 'DELETE FROM bombardments WHERE gameId = ?';
        const deleteAllInserts = [gameId];
        await pool.query(deleteAll, deleteAllInserts);
    }

    return listOfPositionsHit;
};
