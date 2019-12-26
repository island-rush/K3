import { PlanType } from '../../types';
import { pool } from '../database';

/**
 * Represents rows for plans in the database.
 */
export class Plan implements PlanType {
    planGameId: number;

    planTeamId: number;

    planPieceId: number;

    planMovementOrder: number;

    planPositionId: number;

    planSpecialFlag: number;

    constructor(planPieceId: number, planMovementOrder: number) {
        this.planPieceId = planPieceId;
        this.planMovementOrder = planMovementOrder;
    }

    /**
     * Get's information from database about this plan.
     */
    async init() {
        const queryString = 'SELECT * FROM plans WHERE planPieceId = ? AND planMovementOrder = ?';
        const inserts = [this.planPieceId, this.planMovementOrder];
        const [results]: any = await pool.query(queryString, inserts);

        if (results.length !== 1) {
            return null;
        }
        Object.assign(this, results[0]);
        return this;
    }

    /**
     * Insert Plans into the database.
     */
    static async insert(plansToInsert: any) {
        const queryString = 'INSERT INTO plans (planGameId, planTeamId, planPieceId, planMovementOrder, planPositionId, planSpecialFlag) VALUES ?';
        const inserts = [plansToInsert];
        await pool.query(queryString, inserts);
    }

    /**
     * Delete all plans for a certain piece.
     */
    static async delete(pieceId: number) {
        const queryString = 'DELETE FROM plans WHERE planPieceId = ?';
        const inserts = [pieceId];
        await pool.query(queryString, inserts);
    }

    /**
     * Get current movement order for this game's team.
     */
    static async getCurrentMovementOrder(gameId: number, gameTeam: number) {
        const queryString = 'SELECT planMovementOrder FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planMovementOrder ASC LIMIT 1';
        const inserts = [gameId, gameTeam];
        const [results]: any = await pool.query(queryString, inserts);
        return results.length !== 0 ? results[0].planMovementOrder : null;
    }

    /**
     * Get all piece collisions from plans.
     */
    static async getCollisions(gameId: number, movementOrder: number) {
        const queryString =
            'SELECT * FROM (SELECT pieceId as pieceId0, pieceTypeId as pieceTypeId0, pieceContainerId as pieceContainerId0, piecePositionId as piecePositionId0, planPositionId as planPositionId0 FROM plans NATURAL JOIN pieces WHERE planPieceId = pieceId AND pieceTeamId = 0 AND pieceGameId = ? AND planMovementOrder = ?) as a JOIN (SELECT pieceId as pieceId1, pieceTypeId as pieceTypeId1, pieceContainerId as pieceContainerId1, piecePositionId as piecePositionId1, planPositionId as planPositionId1 FROM plans NATURAL JOIN pieces WHERE planPieceId = pieceId AND pieceTeamId = 1 AND pieceGameId = ? AND planMovementOrder = ?) as b ON piecePositionId0 = planPositionId1 AND planPositionId0 = piecePositionId1';
        const inserts = [gameId, movementOrder, gameId, movementOrder];
        const [results] = await pool.query(queryString, inserts);
        return results;
    }

    /**
     * Get all positions/pieces where both teams exist.
     */
    static async getPositionCombinations(gameId: number) {
        const queryString =
            'SELECT * FROM (SELECT pieceId as pieceId0, piecePositionId as piecePositionId0, pieceTypeId as pieceTypeId0, pieceContainerId as pieceContainerId0 FROM pieces WHERE pieceGameId = ? AND pieceTeamId = 0) as a JOIN (SELECT pieceId as pieceId1, piecePositionId as piecePositionId1, pieceTypeId as pieceTypeId1, pieceContainerId as pieceContainerId1 FROM pieces WHERE pieceGameId = ? AND pieceTeamId = 1) as b ON piecePositionId0 = piecePositionId1';
        const inserts = [gameId, gameId];
        const [results] = await pool.query(queryString, inserts);
        return results;
    }

    /**
     * Get all confirmed plans for this game's team.
     */
    static async getConfirmedPlans(gameId: number, gameTeam: number) {
        const queryString = 'SELECT * FROM plans WHERE planGameId = ? AND planTeamId = ? ORDER BY planPieceId, planMovementOrder ASC';
        const inserts = [gameId, gameTeam];
        const [resultPlans]: any = await pool.query(queryString, inserts);

        // formatting for the client, needs it in this object kinda way
        const confirmedPlans: any = {};
        for (let x = 0; x < resultPlans.length; x++) {
            const { planPieceId, planPositionId, planSpecialFlag } = resultPlans[x];
            const type = planSpecialFlag === 0 ? 'move' : planSpecialFlag === 1 ? 'container' : 'NULL_SPECIAL';

            if (!(planPieceId in confirmedPlans)) {
                confirmedPlans[planPieceId] = [];
            }

            confirmedPlans[planPieceId].push({
                type,
                positionId: planPositionId
            });
        }

        return confirmedPlans;
    }
}

export default Plan;
