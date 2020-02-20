import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
import { ACTIVATED, COMM_INTERRUPT_RANGE, COMM_INTERRUPT_ROUNDS, DEACTIVATED, distanceMatrix, LIST_ALL_POSITIONS_TYPE } from '../../../constants';
import { CommInterruptType, GameType, BlueOrRedTeamId } from '../../../types';

export const insertCommInterrupt = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: LIST_ALL_POSITIONS_TYPE) => {
    let queryString = 'SELECT * FROM commInterrupt WHERE gameId = ? AND teamId = ? AND positionId = ?';
    let inserts = [gameId, gameTeam, selectedPositionId];
    const [results] = await pool.query<RowDataPacket[] & CommInterruptType[]>(queryString, inserts);

    // prevent duplicate entries if possible
    if (results.length !== 0) {
        return false;
    }

    queryString = 'INSERT INTO commInterrupt (gameId, teamId, positionId, roundsLeft, activated) VALUES (?, ?, ?, ?, ?)';
    inserts = [gameId, gameTeam, selectedPositionId, COMM_INTERRUPT_ROUNDS, DEACTIVATED];
    await pool.query(queryString, inserts);
    return true;
};

export const getCommInterrupt = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM commInterrupt WHERE gameId = ? AND (activated = ? OR teamId = ?)';
    const inserts = [gameId, ACTIVATED, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & CommInterruptType[]>(queryString, inserts);

    const listOfCommInterrupt: LIST_ALL_POSITIONS_TYPE[] = [];
    for (let x = 0; x < results.length; x++) {
        listOfCommInterrupt.push(results[x].positionId);
    }

    return listOfCommInterrupt;
};

export const useCommInterrupt = async (gameId: GameType['gameId']) => {
    // take inactivated comm interrupt and activate them, let clients know which positions are disrupted
    let queryString = 'UPDATE commInterrupt SET activated = ? WHERE gameId = ?';
    let inserts = [ACTIVATED, gameId];
    await pool.query(queryString, inserts);

    queryString = 'SELECT * FROM commInterrupt WHERE gameId = ?'; // all should be activated, no need to specify
    inserts = [gameId];
    const [results] = await pool.query<RowDataPacket[] & CommInterruptType[]>(queryString, inserts);

    if (results.length === 0) {
        return [];
    }

    // need the positions anyway to give back to the clients for updating
    const fullListOfPositions0: LIST_ALL_POSITIONS_TYPE[] = [];
    const fullListOfPositions1: LIST_ALL_POSITIONS_TYPE[] = [];
    const masterListOfAllPositions: LIST_ALL_POSITIONS_TYPE[] = [];
    for (let x = 0; x < results.length; x++) {
        const thisResult = results[x];
        const { positionId, teamId } = thisResult;
        if (teamId === 0) {
            fullListOfPositions0.push(positionId);
        } else {
            fullListOfPositions1.push(positionId);
        }
        masterListOfAllPositions.push(positionId);
    }

    const positionsInTheseRanges0: number[] = [];
    for (let y = 0; y < fullListOfPositions0.length; y++) {
        const currentCenterPosition = fullListOfPositions0[y];
        for (let z = 0; z < distanceMatrix[currentCenterPosition].length; z++) {
            if (distanceMatrix[currentCenterPosition][z] <= COMM_INTERRUPT_RANGE) {
                positionsInTheseRanges0.push(z);
            }
        }
    }
    const positionsInTheseRanges1: number[] = [];
    for (let y = 0; y < fullListOfPositions1.length; y++) {
        const currentCenterPosition = fullListOfPositions1[y];
        for (let z = 0; z < distanceMatrix[currentCenterPosition].length; z++) {
            if (distanceMatrix[currentCenterPosition][z] <= COMM_INTERRUPT_RANGE) {
                positionsInTheseRanges1.push(z);
            }
        }
    }

    queryString =
        'DELETE FROM plans WHERE planPieceId IN (SELECT pieceId FROM pieces WHERE pieceGameId = ? AND pieceTeamId = ? AND piecePositionId in (?))';
    if (positionsInTheseRanges0.length > 0) {
        const inserts = [gameId, 0, positionsInTheseRanges0];
        await pool.query(queryString, inserts);
    }
    if (positionsInTheseRanges1.length > 0) {
        const inserts = [gameId, 1, positionsInTheseRanges1];
        await pool.query(queryString, inserts);
    }

    return masterListOfAllPositions;
};

export const decreaseCommInterrupt = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE commInterrupt SET roundsLeft = roundsLeft - 1 WHERE gameId = ? AND activated = ?';
    const inserts = [gameId, ACTIVATED];
    await pool.query(queryString, inserts);

    queryString = 'DELETE FROM commInterrupt WHERE roundsLeft = 0';
    await pool.query(queryString);
};
