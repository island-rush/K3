import { RowDataPacket } from 'mysql2/promise';
import { ACTIVATED, distanceMatrix, MISSILE_ATTACK_RANGE_CHANGE, LIST_ALL_POSITIONS_TYPE } from '../../../constants';
import { CapabilitiesState, MissileAttackType, MissileDisruptType, GameType, PieceType, BlueOrRedTeamId } from '../../../types';
import { pool } from '../../database';
import { Piece } from '../Piece';

export const insertMissileAttack = async (gameId: GameType['gameId'], missilePiece: Piece, targetPiece: Piece) => {
    // assume we know everything is setup by missileAttackConfirm (pieces exist, within range...)

    const queryString = 'SELECT * FROM missileAttacks WHERE gameId = ? AND missileId = ?';
    const inserts = [gameId, missilePiece.pieceId];
    const [results] = await pool.query<RowDataPacket[] & MissileAttackType[]>(queryString, inserts);

    // prevent duplicate entries if possible (already have an attack for this missile)
    if (results.length !== 0) {
        return false;
    }

    const insertQuery = 'INSERT INTO missileAttacks (gameId, teamId, missileId, targetId) VALUES (?, ?, ?, ?)';
    const insertInserts = [gameId, missilePiece.pieceTeamId, missilePiece.pieceId, targetPiece.pieceId];
    await pool.query(insertQuery, insertInserts);
    return true;
};

export const getMissileAttack = async (gameId: GameType['gameId'], teamId: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM missileAttacks WHERE gameId = ? AND teamId = ?';
    const inserts = [gameId, teamId];
    const [results] = await pool.query<RowDataPacket[] & MissileAttackType[]>(queryString, inserts);

    const confirmedMissileAttacks: CapabilitiesState['confirmedMissileAttacks'] = [];

    for (let x = 0; x < results.length; x++) {
        const thisMissileAttack = results[x];
        confirmedMissileAttacks.push({
            missileId: thisMissileAttack.missileId,
            targetId: thisMissileAttack.targetId
        });
    }

    return confirmedMissileAttacks;
};

export const useMissileAttack = async (gameId: GameType['gameId']) => {
    // go through each attack and return the 'results' of the attack or which positions to highlight?

    // start with big join selection that grabs all piece data (mostly just the target piece typeId / position to calculate hit %)
    const queryString =
        'SELECT a.pieceId as targetId, a.pieceTypeId as targetTypeId, a.piecePositionId as targetPositionId, b.piecePositionId as missilePositionId, b.pieceId as missileId FROM missileAttacks JOIN pieces a ON targetId = a.pieceId JOIN pieces b ON missileId = b.pieceId WHERE gameId = ?';
    const inserts = [gameId];

    type QueryResultType = {
        targetId: PieceType['pieceId'];
        targetPositionId: PieceType['piecePositionId'];
        targetTypeId: PieceType['pieceTypeId'];
        missilePositionId: PieceType['piecePositionId'];
        missileId: PieceType['pieceId'];
    };

    const [results] = await pool.query<RowDataPacket[] & QueryResultType[]>(queryString, inserts);

    const disruptQuery = 'SELECT * FROM missileDisrupts WHERE gameId = ? AND activated = ?';
    const disruptInserts = [gameId, ACTIVATED];
    const [disrupts] = await pool.query<RowDataPacket[] & MissileDisruptType[]>(disruptQuery, disruptInserts);

    const disruptedMissileIds = [];
    for (let x = 0; x < disrupts.length; x++) {
        disruptedMissileIds.push(disrupts[x].missileId);
    }

    const listOfMissilesToDelete = [];
    const listOfTargetsToDelete = [];
    const listOfPositionsHit: LIST_ALL_POSITIONS_TYPE[] = [];

    for (let x = 0; x < results.length; x++) {
        const { targetId, targetPositionId, missilePositionId, missileId } = results[x];

        if (disruptedMissileIds.includes(missileId)) continue; // skip if missile is disrupted...

        listOfMissilesToDelete.push(missileId);
        // TODO: determine hit based on distance / type? (shouldn't work from too far away but probably has at least 2 hex range? (only a few hexes around the missile site 1 hex away...))
        // type is also part of the query, but not used here (yet)
        const distance = distanceMatrix[missilePositionId][targetPositionId];
        let percentHit: number;

        if (!MISSILE_ATTACK_RANGE_CHANGE[distance]) {
            percentHit = 0;
        } else {
            percentHit = MISSILE_ATTACK_RANGE_CHANGE[distance];
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
        const deleteAll = 'DELETE FROM missileAttacks WHERE gameId = ?';
        const deleteAllInserts = [gameId];
        await pool.query(deleteAll, deleteAllInserts);
    }

    if (listOfMissilesToDelete.length > 0) {
        const deleteMissiles = 'DELETE FROM pieces WHERE pieceId in (?)';
        const deleteMissileInserts = [listOfMissilesToDelete];
        await pool.query(deleteMissiles, deleteMissileInserts);
    }

    return listOfPositionsHit;
};
