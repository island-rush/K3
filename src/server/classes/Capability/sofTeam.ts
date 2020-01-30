import { RowDataPacket } from 'mysql2/promise';
// prettier-ignore
import { ALL_AIRFIELD_LOCATIONS, ALL_MISSILE_SILO_LOCATIONS, BLUE_TEAM_ID, GROUND_GUARDING_PIECES, PIECES_WITH_FUEL, RED_TEAM_ID, SOF_TEAM_TYPE_ID, MISSILE_TYPE_ID } from '../../../constants';
import { PieceType } from '../../../types';
import { pool } from '../../database';
import { Game } from '../Game';

export const sofTakeoutAirfieldsAndSilos = async (game: Game) => {
    // planes (including helicopters) unguarded on an airfield (enemy airfield) are taken out
    // missiles unguarded in silo are taken out

    // TODO: could combine these requests, but doing things individually for simplicity for now (make it more efficient later if needed)

    // get all the sof teams (for both blue and red) (can also only get them for positions that matter)
    const queryString = 'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTypeId = ? AND piecePositionId in (?)';
    const inserts = [game.gameId, SOF_TEAM_TYPE_ID, [...ALL_AIRFIELD_LOCATIONS, ...ALL_MISSILE_SILO_LOCATIONS]];
    const [sofTeams] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);

    // get all the planes (for both blue and red)
    const queryString2 = 'SELECT * FROM pieces WHERE pieceGameId = ? AND pieceTypeId IN (?) AND piecePositionId in (?)';
    const inserts2 = [game.gameId, GROUND_GUARDING_PIECES, [...ALL_AIRFIELD_LOCATIONS, ...ALL_MISSILE_SILO_LOCATIONS]];
    const [guardingPieces] = await pool.query<RowDataPacket[] & PieceType[]>(queryString2, inserts2);

    const listOfBlueSilosToHit = [-1]; // shouldn't need to worry about 2 teams hitting the same position, that wouldn't make sense (SOF team is part of guard piece)
    const listOfRedSilosToHit = [-1];
    const listOfBlueAirfieldsToHit = [-1];
    const listOfRedAirfieldsToHit = [-1];

    for (let x = 0; x < sofTeams.length; x++) {
        const thisSofTeam = sofTeams[x];

        // for this sof team, if there is no enemy guard, good to hit
        let isGuardingThisPos = false;

        for (let y = 0; y < guardingPieces.length; y++) {
            const thisGuard = guardingPieces[y];

            if (thisSofTeam.piecePositionId !== thisGuard.piecePositionId) continue; // don't care if not in the same position

            if (thisSofTeam.pieceTeamId !== thisGuard.pieceTeamId) {
                isGuardingThisPos = true;
            }
        }

        if (!isGuardingThisPos) {
            // hit the position for the opposite team of the sof team
            if (ALL_MISSILE_SILO_LOCATIONS.includes(thisSofTeam.piecePositionId)) {
                if (thisSofTeam.pieceTeamId === RED_TEAM_ID) {
                    listOfBlueSilosToHit.push(thisSofTeam.piecePositionId); // if the sof team is red, then this position will be hitting the blue pieces
                } else {
                    listOfRedSilosToHit.push(thisSofTeam.piecePositionId);
                }
            }

            if (ALL_AIRFIELD_LOCATIONS.includes(thisSofTeam.piecePositionId)) {
                if (thisSofTeam.pieceTeamId === RED_TEAM_ID) {
                    listOfBlueAirfieldsToHit.push(thisSofTeam.piecePositionId);
                } else {
                    listOfRedAirfieldsToHit.push(thisSofTeam.piecePositionId);
                }
            }
        }
    }

    const destroyQuery =
        'DELETE FROM pieces WHERE pieceGameId = ? AND ((pieceTeamId = ? AND piecePositionId IN (?) AND pieceTypeId IN (?)) OR (pieceTeamId = ? AND piecePositionId IN (?) AND pieceTypeId IN (?)) OR (pieceTeamId = ? AND piecePositionId IN (?) AND pieceTypeId = ?) OR (pieceTeamId = ? AND piecePositionId IN (?) AND pieceTypeId = ?))';
    const destroyInserts = [
        game.gameId,
        BLUE_TEAM_ID,
        listOfBlueAirfieldsToHit,
        PIECES_WITH_FUEL,
        RED_TEAM_ID,
        listOfRedAirfieldsToHit,
        PIECES_WITH_FUEL,
        BLUE_TEAM_ID,
        listOfBlueSilosToHit,
        MISSILE_TYPE_ID,
        RED_TEAM_ID,
        listOfRedSilosToHit,
        MISSILE_TYPE_ID
    ];
    await pool.query(destroyQuery, destroyInserts);
};
