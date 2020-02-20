import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
import { BLUE_TEAM_ID, RAISE_MORALE_ROUNDS, RED_TEAM_ID, TYPE_AIR, TYPE_LAND, TYPE_OWNERS, TYPE_SEA, TYPE_SPECIAL } from '../../../constants';
import { RaiseMoraleType, GameType, BlueOrRedTeamId, ControllerType } from '../../../types';

export const insertRaiseMorale = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedCommanderType: ControllerType) => {
    let queryString = 'SELECT * FROM raiseMorale WHERE gameId = ? AND teamId = ? AND commanderType = ?';
    let inserts = [gameId, gameTeam, selectedCommanderType];
    const [results] = await pool.query<RowDataPacket[] & RaiseMoraleType[]>(queryString, inserts);

    // prevent duplicate entries if possible
    if (results.length !== 0) {
        return false;
    }

    queryString = 'INSERT INTO raiseMorale (gameId, teamId, commanderType, roundsLeft) VALUES (?, ?, ?, ?)';
    inserts = [gameId, gameTeam, selectedCommanderType, RAISE_MORALE_ROUNDS - 1]; // -1 because already executing for the current round
    await pool.query(queryString, inserts);

    queryString = 'UPDATE pieces SET pieceMoves = pieceMoves + 1 WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId in (?)';
    const inserts2 = [gameId, gameTeam, TYPE_OWNERS[selectedCommanderType]];
    await pool.query(queryString, inserts2);

    return true;
};

export const decreaseRaiseMorale = async (gameId: GameType['gameId']) => {
    const conn = await pool.getConnection();

    let queryString = 'DELETE FROM raiseMorale WHERE roundsLeft = 0';
    await conn.query(queryString);

    queryString = 'UPDATE raiseMorale SET roundsLeft = roundsLeft - 1 WHERE gameId = ?';
    let inserts = [gameId];
    await conn.query(queryString, inserts);

    queryString = 'SELECT * from raiseMorale WHERE gameId = ?';
    const [results] = await conn.query<RowDataPacket[] & RaiseMoraleType[]>(queryString, inserts);

    // TODO: probably cleaner way of putting this (more explicit with constants...)
    const updateArrays: any = [
        { 1: 0, 2: 0, 3: 0, 4: 0 },
        { 1: 0, 2: 0, 3: 0, 4: 0 }
    ];

    for (let x = 0; x < results.length; x++) {
        const thisRaiseMorale = results[x];
        const { teamId, commanderType } = thisRaiseMorale;
        updateArrays[teamId][commanderType]++;
    }

    // TODO: do this in 1 statement instead of several (should allow multiple queries in single prepared statement (bulk but would work...(also more efficient if 1 query (but bigger / more complex?))))
    queryString = 'UPDATE pieces SET pieceMoves = pieceMoves + ? WHERE pieceGameId = ? AND pieceTeamId = ? AND pieceTypeId in (?)';

    inserts = [updateArrays[BLUE_TEAM_ID][TYPE_AIR], gameId, BLUE_TEAM_ID, TYPE_OWNERS[TYPE_AIR]];
    await conn.query(queryString, inserts);

    inserts = [updateArrays[BLUE_TEAM_ID][TYPE_LAND], gameId, BLUE_TEAM_ID, TYPE_OWNERS[TYPE_LAND]];
    await conn.query(queryString, inserts);

    inserts = [updateArrays[BLUE_TEAM_ID][TYPE_SEA], gameId, BLUE_TEAM_ID, TYPE_OWNERS[TYPE_SEA]];
    await conn.query(queryString, inserts);

    inserts = [updateArrays[BLUE_TEAM_ID][TYPE_SPECIAL], gameId, BLUE_TEAM_ID, TYPE_OWNERS[TYPE_SPECIAL]];
    await conn.query(queryString, inserts);

    inserts = [updateArrays[RED_TEAM_ID][TYPE_AIR], gameId, RED_TEAM_ID, TYPE_OWNERS[TYPE_AIR]];
    await conn.query(queryString, inserts);

    inserts = [updateArrays[RED_TEAM_ID][TYPE_LAND], gameId, RED_TEAM_ID, TYPE_OWNERS[TYPE_LAND]];
    await conn.query(queryString, inserts);

    inserts = [updateArrays[RED_TEAM_ID][TYPE_SEA], gameId, RED_TEAM_ID, TYPE_OWNERS[TYPE_SEA]];
    await conn.query(queryString, inserts);

    inserts = [updateArrays[RED_TEAM_ID][TYPE_SPECIAL], gameId, RED_TEAM_ID, TYPE_OWNERS[TYPE_SPECIAL]];
    await conn.query(queryString, inserts);

    conn.release();
};

export const getRaiseMorale = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    // TODO: handle more than 1 raise morale for double boosting (how would this look like when letting client know (object? / array?))
    const queryString = 'SELECT * FROM raiseMorale WHERE gameId = ?';
    const inserts = [gameId, gameTeam];
    const [results] = await pool.query<RowDataPacket[] & RaiseMoraleType[]>(queryString, inserts);

    const listOfCommandersBoosted = [];
    for (let x = 0; x < results.length; x++) {
        listOfCommandersBoosted.push(results[x].commanderType);
    }

    return listOfCommandersBoosted;
};
