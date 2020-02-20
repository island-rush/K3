import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../';
// prettier-ignore
import { ACTIVATED, ALL_AIRFIELD_LOCATIONS, ALL_FLAG_LOCATIONS, DEACTIVATED, distanceMatrix, DRAGON_ISLAND_ID, EAGLE_ISLAND_ID, ISLAND_POSITIONS, NEUTRAL_TEAM_ID, NUKE_RANGE, LIST_ALL_POSITIONS_TYPE, FLAG_0_LOCATION, FLAG_1_LOCATION, FLAG_11_LOCATION, FLAG_12_LOCATION } from '../../../constants';
import { NukeType, GameType, BlueOrRedTeamId } from '../../../types';
import { Game } from '../Game';

export const insertNuke = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: LIST_ALL_POSITIONS_TYPE) => {
    // TODO: Could prevent nuking a different position again?
    let queryString = 'SELECT * FROM nukes WHERE gameId = ? AND positionId = ? AND (teamId = ? OR activated = ?)';
    let inserts = [gameId, selectedPositionId, gameTeam, ACTIVATED];
    const [results] = await pool.query<RowDataPacket[] & NukeType[]>(queryString, inserts);

    // prevent duplicate entries if possible
    if (results.length !== 0) {
        return false;
    }

    for (let x = 0; x < distanceMatrix[parseInt(selectedPositionId.toString())].length; x++) {
        // 2 hexes away distance check
        if (distanceMatrix[selectedPositionId][x] <= 2) {
            if (ISLAND_POSITIONS[DRAGON_ISLAND_ID].includes(x as LIST_ALL_POSITIONS_TYPE)) {
                return false;
            }
            if (ISLAND_POSITIONS[EAGLE_ISLAND_ID].includes(x as LIST_ALL_POSITIONS_TYPE)) {
                return false;
            }
        }

        // can't kill a flag, too much
        if (distanceMatrix[selectedPositionId][x] <= NUKE_RANGE) {
            if (x === FLAG_0_LOCATION || x === FLAG_1_LOCATION || x === FLAG_11_LOCATION || x === FLAG_12_LOCATION) {
                return false;
            }
        }
    }

    // don't allow nuking of flag (these positions allows it)
    if ([].includes(selectedPositionId)) {
        return false;
    }

    // TODO: humanitarian not available after using this

    queryString = 'INSERT INTO nukes (gameId, teamId, positionId, activated) VALUES (?, ?, ?, ?)';
    inserts = [gameId, gameTeam, selectedPositionId, DEACTIVATED];
    await pool.query(queryString, inserts);
    return true;
};

export const useNukes = async (gameId: GameType['gameId']) => {
    let queryString = 'UPDATE nukes SET activated = ? WHERE gameId = ?';
    let inserts = [ACTIVATED, gameId];
    await pool.query(queryString, inserts);

    queryString = 'SELECT * FROM nukes WHERE gameId = ?';
    inserts = [gameId];
    const [allNukes] = await pool.query<RowDataPacket[] & NukeType[]>(queryString, inserts);

    const listPositions: LIST_ALL_POSITIONS_TYPE[] = [];
    for (let x = 0; x < allNukes.length; x++) {
        listPositions.push(allNukes[x].positionId);
    }

    if (listPositions.length > 0) {
        const actualPositions = [];
        for (let x = 0; x < listPositions.length; x++) {
            const thisNukeCenter = listPositions[x];
            for (let y = 0; y < distanceMatrix[thisNukeCenter].length; y++) {
                if (distanceMatrix[thisNukeCenter][y] <= NUKE_RANGE) {
                    actualPositions.push(y);
                }
            }
        }

        queryString = 'DELETE FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?)';
        const newinserts = [gameId, actualPositions];
        await pool.query(queryString, newinserts);

        const thisGame = await new Game(gameId).init();

        for (let z = 0; z < actualPositions.length; z++) {
            const currentPosition = actualPositions[z];
            if (ALL_AIRFIELD_LOCATIONS.includes(currentPosition)) {
                // need to set to no owner
                const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(currentPosition);
                await thisGame.setAirfield(airfieldNum, NEUTRAL_TEAM_ID);
            }
            if (ALL_FLAG_LOCATIONS.includes(currentPosition)) {
                // need to set to no owner
                const flagNum = ALL_FLAG_LOCATIONS.indexOf(currentPosition);
                await thisGame.setFlag(flagNum, NEUTRAL_TEAM_ID);
            }
        }
    }

    // TODO: update airfield and flag ownerships for areas that are nuked (no one owns them now)

    return listPositions;
};

export const getNukes = async (gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) => {
    const queryString = 'SELECT * FROM nukes WHERE gameId = ? AND (teamId = ? OR activated = ?)';
    const inserts = [gameId, gameTeam, ACTIVATED];
    const [results] = await pool.query<RowDataPacket[] & NukeType[]>(queryString, inserts);

    const listOfNukes: LIST_ALL_POSITIONS_TYPE[] = [];
    for (let x = 0; x < results.length; x++) {
        listOfNukes.push(results[x].positionId);
    }

    return listOfNukes;
};
