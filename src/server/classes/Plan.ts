import { RowDataPacket } from 'mysql2/promise';
import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { BlueOrRedTeamId, GameType, PieceType, PlanType } from '../../types';
import { pool } from '../database';

/**
 * Represents rows for plans in the database.
 */
export class Plan implements PlanType {
    planGameId: PlanType['planGameId'];
    planTeamId: PlanType['planTeamId'];
    planPieceId: PlanType['planPieceId'];
    planMovementOrder: PlanType['planMovementOrder'];
    planPositionId: PlanType['planPositionId'];

    constructor(planPieceId: PlanType['planPieceId'], planMovementOrder: PlanType['planMovementOrder']) {
        this.planPieceId = planPieceId;
        this.planMovementOrder = planMovementOrder;
    }

    /**
     * Get's information from database about this plan.
     */
    async init() {
        const queryString = 'SELECT * FROM plans WHERE planPieceId = ? AND planMovementOrder = ?';
        const inserts = [this.planPieceId, this.planMovementOrder];
        const [results] = await pool.query<RowDataPacket[] & PlanType[]>(queryString, inserts);

        if (results.length !== 1) {
            return null;
        }
        Object.assign(this, results[0]);
        return this;
    }

    /**
     * Insert Plans into the database.
     */
    static async insert(plansToInsert: any, pieceId: PieceType['pieceId']) {
        // just in case there was already plans
        const deleteString = 'DELETE FROM plans WHERE planPieceId = ?';
        const deleteInserts = [pieceId];
        await pool.query(deleteString, deleteInserts);

        const queryString = 'INSERT INTO plans (planGameId, planTeamId, planPieceId, planMovementOrder, planPositionId) VALUES ?';
        const inserts = [plansToInsert];
        await pool.query(queryString, inserts);
    }

    /**
     * Delete all plans for a certain piece.
     */
    static async delete(pieceId: PieceType['pieceId']) {
        const queryString = 'DELETE FROM plans WHERE planPieceId = ?';
        const inserts = [pieceId];
        await pool.query(queryString, inserts);
    }

    /**
     * Get current movement order for this game's team.
     */
    static async getCurrentMovementOrder(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        const queryString = 'SELECT planMovementOrder FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planMovementOrder ASC LIMIT 1';
        const inserts = [gameId, gameTeam];
        const [results] = await pool.query<RowDataPacket[] & PlanType[]>(queryString, inserts);
        return results.length !== 0 ? results[0].planMovementOrder : null;
    }

    /**
     * Get all piece collisions from plans.
     */
    static async getCollisions(gameId: GameType['gameId'], movementOrder: PlanType['planMovementOrder']) {
        const queryString =
            'SELECT * FROM (SELECT pieceId as pieceId0, pieceTypeId as pieceTypeId0, pieceContainerId as pieceContainerId0, piecePositionId as piecePositionId0, planPositionId as planPositionId0 FROM plans NATURAL JOIN pieces WHERE planPieceId = pieceId AND pieceTeamId = 0 AND pieceGameId = ? AND planMovementOrder = ? AND pieceContainerId IS NULL) as a JOIN (SELECT pieceId as pieceId1, pieceTypeId as pieceTypeId1, pieceContainerId as pieceContainerId1, piecePositionId as piecePositionId1, planPositionId as planPositionId1 FROM plans NATURAL JOIN pieces WHERE planPieceId = pieceId AND pieceTeamId = 1 AND pieceGameId = ? AND planMovementOrder = ? AND pieceContainerId IS NULL) as b ON piecePositionId0 = planPositionId1 AND planPositionId0 = piecePositionId1';
        const inserts = [gameId, movementOrder, gameId, movementOrder];
        const [results] = await pool.query<RowDataPacket[]>(queryString, inserts); // TODO: weird datatype here with query
        return results as any;
    }

    /**
     * Get all positions/pieces where both teams exist.
     */
    static async getPositionCombinations(gameId: GameType['gameId']) {
        // TODO: use constants as query params in the queryString (don't use pieceTeamId = 0, do pieceTeamId = ? and fill it in with constant)
        const queryString =
            'SELECT * FROM (SELECT pieceId as pieceId0, piecePositionId as piecePositionId0, pieceTypeId as pieceTypeId0, pieceContainerId as pieceContainerId0 FROM pieces WHERE pieceGameId = ? AND pieceTeamId = 0 AND pieceContainerId IS NULL) as a JOIN (SELECT pieceId as pieceId1, piecePositionId as piecePositionId1, pieceTypeId as pieceTypeId1, pieceContainerId as pieceContainerId1 FROM pieces WHERE pieceGameId = ? AND pieceTeamId = 1 AND pieceContainerId IS NULL) as b ON piecePositionId0 = piecePositionId1';
        const inserts = [gameId, gameId];
        const [results] = await pool.query<RowDataPacket[]>(queryString, inserts); // TODO: weird datatype with query
        return results as any;
    }

    /**
     * Get all confirmed plans for this game's team.
     */
    static async getConfirmedPlans(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        const queryString = 'SELECT * FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planPieceId, planMovementOrder ASC';
        const inserts = [gameId, gameTeam];
        const [resultPlans] = await pool.query<RowDataPacket[] & PlanType[]>(queryString, inserts);

        // formatting for the client, needs it in this object kinda way
        const confirmedPlans: { [pieceId: number]: LIST_ALL_POSITIONS_TYPE[] } = {};
        for (let x = 0; x < resultPlans.length; x++) {
            const { planPieceId, planPositionId } = resultPlans[x];

            if (!(planPieceId in confirmedPlans)) {
                confirmedPlans[planPieceId] = [];
            }

            confirmedPlans[planPieceId].push(planPositionId);
        }

        return confirmedPlans;
    }
}
