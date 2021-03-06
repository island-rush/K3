// prettier-ignore
import { AIRBORN_ISR_TYPE_ID, AIR_REFUELING_SQUADRON_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, ARTILLERY_BATTERY_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID, BLUE_TEAM_ID, BOMBER_TYPE_ID, C_130_TYPE_ID, DESTROYER_TYPE_ID, RADAR_TYPE_ID, RED_TEAM_ID, SAM_SITE_TYPE_ID, SOF_TEAM_TYPE_ID, STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID, SUBMARINE_TYPE_ID, TANK_COMPANY_TYPE_ID, TRANSPORT_TYPE_ID, TYPE_FUEL, TYPE_MOVES, NO_PARENT_VALUE } from '../../constants';
import { GameType, PieceType } from '../../types';
import { pool } from '../database';

// prettier-ignore
/**
 * Helper function to generate arrays of piece inserts.
 */
const piece = (pieceGameId: PieceType['pieceGameId'], pieceTeamId: PieceType['pieceTeamId'], pieceTypeId: PieceType['pieceTypeId'], piecePositionId: PieceType['piecePositionId'], pieceOptions: PieceOptions = {}): number[] => {
    // TODO: could have constants to indicated pieceVisible and pieceContainer (not in container == -1)
    const pieceContainerId = pieceOptions.pieceContainerId === undefined ? NO_PARENT_VALUE : pieceOptions.pieceContainerId;
    const pieceVisible = pieceOptions.pieceVisible === undefined ? 0 : pieceOptions.pieceVisible;

    const pieceMoves = TYPE_MOVES[pieceTypeId];
    const pieceFuel = TYPE_FUEL[pieceTypeId];

    return [
        pieceGameId,
        pieceTeamId,
        pieceTypeId,
        piecePositionId,
        pieceContainerId,
        pieceVisible,
        pieceMoves,
        pieceFuel
    ];
};

// prettier-ignore
/**
 * Inserts a list of pre-defined pieces into a game.
 */
export const gameInitialPieces = async (gameId: GameType['gameId']) => {
    // TODO: create an excel doc to help facilitate game creation, read it like a csv to generate values (future idea = game creator interface (right click insert piece))
    const firstPieces: number[][] = [
        // typical battle setup (top left corner meet up on cross-over)
        piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 0),
        piece(gameId, RED_TEAM_ID, TANK_COMPANY_TYPE_ID, 1),
        piece(gameId, BLUE_TEAM_ID, SOF_TEAM_TYPE_ID, 34),
        piece(gameId, RED_TEAM_ID, SOF_TEAM_TYPE_ID, 21),

        // testing container stuff
        piece(gameId, RED_TEAM_ID, TRANSPORT_TYPE_ID, 120),

        // testing victory condition
        piece(gameId, RED_TEAM_ID, TANK_COMPANY_TYPE_ID, 652),
        piece(gameId, RED_TEAM_ID, TANK_COMPANY_TYPE_ID, 690),
        piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 19),

        // pieces to show refueling (starting on airfields)
        piece(gameId, RED_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 21),
        piece(gameId, RED_TEAM_ID, STEALTH_BOMBER_TYPE_ID, 21),
        piece(gameId, RED_TEAM_ID, BOMBER_TYPE_ID, 21),
        piece(gameId, RED_TEAM_ID, AIRBORN_ISR_TYPE_ID, 21),
        piece(gameId, RED_TEAM_ID, AIR_REFUELING_SQUADRON_ID, 21),
        piece(gameId, RED_TEAM_ID, AIR_REFUELING_SQUADRON_ID, 21),

        // show submarines
        piece(gameId, RED_TEAM_ID, SUBMARINE_TYPE_ID, 120),
        piece(gameId, RED_TEAM_ID, SUBMARINE_TYPE_ID, 120),

        // bigger battle setup (meet in the middle)
        piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 118),
        piece(gameId, BLUE_TEAM_ID, ARTILLERY_BATTERY_TYPE_ID, 118),
        piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 118),
        piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 118),

        piece(gameId, RED_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 102),
        piece(gameId, RED_TEAM_ID, ARTILLERY_BATTERY_TYPE_ID, 102),
        piece(gameId, RED_TEAM_ID, ATTACK_HELICOPTER_TYPE_ID, 102),

        // Sea transports to test sea mines
        piece(gameId, BLUE_TEAM_ID, TRANSPORT_TYPE_ID, 121),
        piece(gameId, RED_TEAM_ID, TRANSPORT_TYPE_ID, 122),

        // C130 to test drone swarms
        piece(gameId, RED_TEAM_ID, C_130_TYPE_ID, 21),
        piece(gameId, BLUE_TEAM_ID, C_130_TYPE_ID, 22),

        // testing bombardment
        piece(gameId, BLUE_TEAM_ID, DESTROYER_TYPE_ID, 116),
        piece(gameId, RED_TEAM_ID, TANK_COMPANY_TYPE_ID, 83),
        piece(gameId, RED_TEAM_ID, TANK_COMPANY_TYPE_ID, 99),

        // Testing Battles
        piece(gameId, BLUE_TEAM_ID, STEALTH_BOMBER_TYPE_ID, 315),
        piece(gameId, RED_TEAM_ID, RADAR_TYPE_ID, 316),

        // Testing Sams
        piece(gameId, RED_TEAM_ID, SAM_SITE_TYPE_ID, 31),
        piece(gameId, RED_TEAM_ID, SAM_SITE_TYPE_ID, 31),
        // piece(gameId, RED_TEAM_ID, SAM_SITE_TYPE_ID, 31),
        // piece(gameId, RED_TEAM_ID, SAM_SITE_TYPE_ID, 31),
        // piece(gameId, RED_TEAM_ID, SAM_SITE_TYPE_ID, 31),
        piece(gameId, BLUE_TEAM_ID, BOMBER_TYPE_ID, 87),
        piece(gameId, BLUE_TEAM_ID, BOMBER_TYPE_ID, 87),
        piece(gameId, BLUE_TEAM_ID, BOMBER_TYPE_ID, 87),
        piece(gameId, BLUE_TEAM_ID, BOMBER_TYPE_ID, 87),
        piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 87),
        piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 87),
        piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 87),
        piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 87)
    ];

    const queryString = 'INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES ?';
    const inserts = [firstPieces];
    await pool.query(queryString, inserts);
};

/**
 * List of optional parameters for creating a piece.
 */
type PieceOptions = {
    pieceContainerId?: PieceType['pieceContainerId'];
    pieceVisible?: PieceType['pieceVisible'];
};
