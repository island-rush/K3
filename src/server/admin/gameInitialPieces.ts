import pool from "../database";
import {
    TYPE_MOVES,
    TYPE_FUEL,
    TANK_COMPANY_TYPE_ID,
    BLUE_TEAM_ID,
    RED_TEAM_ID,
    AIRBORN_ISR_TYPE_ID,
    STEALTH_FIGHTER_TYPE_ID,
    AIR_REFUELING_SQUADRON_ID,
    SUBMARINE_TYPE_ID,
    ARMY_INFANTRY_COMPANY_TYPE_ID,
    ARTILLERY_BATTERY_TYPE_ID,
    STEALTH_BOMBER_TYPE_ID,
    BOMBER_TYPE_ID,
    ATTACK_HELICOPTER_TYPE_ID,
    A_C_CARRIER_TYPE_ID,
    TRANSPORT_TYPE_ID,
    SAM_SITE_TYPE_ID,
    MARINE_INFANTRY_COMPANY_TYPE_ID,
    TACTICAL_AIRLIFT_SQUADRON_TYPE_ID,
    SOF_TEAM_TYPE_ID,
    C_130_TYPE_ID
} from "../../client/src/constants/gameConstants";

type PieceOptions = {
    pieceContainerId?: number;
    pieceVisible?: number;
    pieceMoves?: number;
    pieceFuel?: number;
};

// prettier-ignore
const piece = (pieceGameId: number, pieceTeamId: number, pieceTypeId: number, piecePositionId: number, pieceOptions: PieceOptions = {}): Array<number> => {
	//TODO: could have constants to indicated pieceVisible and pieceContainer (not in container == -1)
	const pieceContainerId = pieceOptions.pieceContainerId == undefined ? -1 : pieceOptions.pieceContainerId;
	const pieceVisible = pieceOptions.pieceVisible == undefined ? 0 : pieceOptions.pieceVisible;

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

type PieceInsert = Array<number>;

//prettier-ignore
const gameInitialPieces = async (gameId: number) => {
	const firstPieces: PieceInsert[] = [
		//typical battle setup
		piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 0),
		piece(gameId, RED_TEAM_ID, TANK_COMPANY_TYPE_ID, 1),

		// //refueling setup
		piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 56),
		piece(gameId, BLUE_TEAM_ID, STEALTH_BOMBER_TYPE_ID, 56),
		piece(gameId, BLUE_TEAM_ID, BOMBER_TYPE_ID, 56),
		piece(gameId, BLUE_TEAM_ID, AIRBORN_ISR_TYPE_ID, 56),
		piece(gameId, BLUE_TEAM_ID, AIR_REFUELING_SQUADRON_ID, 58),
		piece(gameId, BLUE_TEAM_ID, AIR_REFUELING_SQUADRON_ID, 58),

		// //show submarines
		piece(gameId, BLUE_TEAM_ID, SUBMARINE_TYPE_ID, 120),
		piece(gameId, BLUE_TEAM_ID, SUBMARINE_TYPE_ID, 120),

		// //big battle setup
		piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 118),
		piece(gameId, BLUE_TEAM_ID, ARTILLERY_BATTERY_TYPE_ID, 118),
		piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 118),
		piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 118),

		piece(gameId, RED_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 102),
		piece(gameId, RED_TEAM_ID, ARTILLERY_BATTERY_TYPE_ID, 102),
		piece(gameId, RED_TEAM_ID, ATTACK_HELICOPTER_TYPE_ID, 102),

		//starting to set up container stuff
		piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, ARTILLERY_BATTERY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, SAM_SITE_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, TANK_COMPANY_TYPE_ID, 7),
		piece(gameId, BLUE_TEAM_ID, TRANSPORT_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, TRANSPORT_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, C_130_TYPE_ID, 21),
		piece(gameId, BLUE_TEAM_ID, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, 21),
		piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 21),
		piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 21),
		piece(gameId, BLUE_TEAM_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, 21),
		piece(gameId, BLUE_TEAM_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, 21),
		piece(gameId, BLUE_TEAM_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, 21),
		piece(gameId, BLUE_TEAM_ID, SOF_TEAM_TYPE_ID, 21),
		piece(gameId, BLUE_TEAM_ID, SOF_TEAM_TYPE_ID, 21),

		piece(gameId, BLUE_TEAM_ID, A_C_CARRIER_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, ATTACK_HELICOPTER_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, ATTACK_HELICOPTER_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, ATTACK_HELICOPTER_TYPE_ID, 8),
		piece(gameId, BLUE_TEAM_ID, STEALTH_FIGHTER_TYPE_ID, 8)
	];

	const queryString = "INSERT INTO pieces (pieceGameId, pieceTeamId, pieceTypeId, piecePositionId, pieceContainerId, pieceVisible, pieceMoves, pieceFuel) VALUES ?";
	const inserts = [firstPieces];
	await pool.query(queryString, inserts);
};

export default gameInitialPieces;
