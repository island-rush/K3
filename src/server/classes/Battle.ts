import { RowDataPacket } from 'mysql2/promise';
import { ATTACK_MATRIX, BLUE_TEAM_ID, PIECES_WITH_FUEL, RED_TEAM_ID, UNABLE_TO_HIT } from '../../constants';
import { BattlePieceStateType, BattlePieceType, BattleQueueType, BlueOrRedTeamId, GameType, MasterRecordType, PieceType } from '../../types';
import { pool } from '../database';
import { Piece } from './Piece';

/**
 * Represents battle row in battleQueue table in the database.
 *
 * Also contains other helping functions that deal with battles and battle items.
 */
export class Battle implements BattleQueueType {
    battleId: BattleQueueType['battleId'];
    battleGameId: BattleQueueType['battleGameId'];
    battlePosA: BattleQueueType['battlePosA'];
    battlePosB: BattleQueueType['battlePosB'];

    constructor(battleId: BattleQueueType['battleId'], options: any) {
        this.battleId = battleId;
        if (options) {
            Object.assign(this, options);
        }
    }

    /**
     * Delete this battle from the database.
     */
    async delete() {
        // update the planes from this battle to subtract fuel
        // TODO: this selection could probably be combined with the update
        const queryString3 = 'SELECT pieceId FROM battlePieces JOIN pieces ON pieceId = battlePieceId WHERE pieceTypeId IN (?) AND battleId = ?';
        const inserts3 = [PIECES_WITH_FUEL, this.battleId];
        const [piecesWithFuel] = await pool.query<RowDataPacket[] & { pieceId: PieceType['pieceId'] }[]>(queryString3, inserts3);

        const listOfPieceIds = [];
        for (let x = 0; x < piecesWithFuel.length; x++) {
            listOfPieceIds.push(piecesWithFuel[x].pieceId);
        }

        if (listOfPieceIds.length !== 0) {
            const queryString2 = 'UPDATE pieces SET pieceFuel = pieceFuel - 1 WHERE pieceId IN (?)';
            const inserts2 = [listOfPieceIds];
            await pool.query(queryString2, inserts2);

            await Piece.deletePlanesWithoutFuel(this.battleGameId);
        }

        const queryString = 'DELETE FROM battleQueue WHERE battleId = ?';
        const inserts = [this.battleId];
        await pool.query(queryString, inserts);
    }

    /**
     * Get sql array of battlePieces/pieces that are tied to this battle.
     */
    async getItems() {
        const queryString = 'SELECT * FROM battlePieces NATURAL JOIN pieces WHERE battleId = ? AND battlePieceId = pieceId';
        const inserts = [this.battleId];
        const [battlePieces] = await pool.query<RowDataPacket[] & BattlePieceType[]>(queryString, inserts);

        if (battlePieces.length === 0) {
            return null;
        }

        return battlePieces;
    }

    /**
     * getItems() but for a specific team.
     */
    async getTeamItems(gameTeam: BlueOrRedTeamId) {
        type subQueryType = {
            attackPieceId: PieceType['pieceId'];
            attackPieceTypeId: PieceType['pieceTypeId'];
            attackPiecePositionId: PieceType['piecePositionId'];
            targetPieceId: PieceType['pieceId'] | null;
            targetPieceTypeId: PieceType['pieceTypeId'] | null;
            targetPiecePositionId: PieceType['piecePositionId'] | null;
        };
        const queryString =
            'SELECT pieceId as attackPieceId, pieceTypeId as attackPieceTypeId, piecePositionId as attackPiecePositionId, tpieceId as targetPieceId, tpieceTypeId as targetPieceTypeId, tpiecePositionId as targetPiecePositionId FROM (SELECT * FROM battlePieces NATUAL JOIN pieces WHERE battlePieceId = pieceId AND battleId = ? AND pieceTeamId = ?) a LEFT JOIN (SELECT pieceId as tpieceId, pieceGameId as tpieceGameId, pieceTeamId as tpieceTeamId, pieceTypeId as tpieceTypeId, piecePositionId as tpiecePositionId, pieceContainerId as tpieceContainerId, pieceVisible as tpieceVisible, pieceMoves as tpieceMoves, pieceFuel as tpieceFuel FROM pieces) b ON a.battlePieceTargetId = b.tpieceId';
        const inserts = [this.battleId, gameTeam];
        const [battleTeamItems] = await pool.query<RowDataPacket[] & subQueryType[]>(queryString, inserts);
        return battleTeamItems; // TODO: do we need to return null explicitly? (this is an empty array ^^^ see getItems for difference (not sure why needed))
    }

    async getBattleState() {
        const blueBattleEventItems = await this.getTeamItems(BLUE_TEAM_ID);
        const redBattleEventItems = await this.getTeamItems(RED_TEAM_ID);
        const blueFriendlyBattlePieces: BattlePieceStateType[] = [];
        const redFriendlyBattlePieces: BattlePieceStateType[] = [];

        // Format for frontend
        for (let x = 0; x < blueBattleEventItems.length; x++) {
            blueFriendlyBattlePieces.push({
                piece: {
                    pieceId: blueBattleEventItems[x].attackPieceId,
                    pieceTypeId: blueBattleEventItems[x].attackPieceTypeId,
                    piecePositionId: blueBattleEventItems[x].attackPiecePositionId
                }
            });
        }
        for (let y = 0; y < redBattleEventItems.length; y++) {
            redFriendlyBattlePieces.push({
                piece: {
                    pieceId: redBattleEventItems[y].attackPieceId,
                    pieceTypeId: redBattleEventItems[y].attackPieceTypeId,
                    piecePositionId: redBattleEventItems[y].attackPiecePositionId
                }
            });
        }

        // Don't send enemy targetting on refresh (used in initialStateAction)
        const blueFriendlyBattlePiecesNoTargets: typeof blueFriendlyBattlePieces = JSON.parse(JSON.stringify(blueFriendlyBattlePieces)); // don't fully understand value / reference, this is simple way of hard copying
        const redFriendlyBattlePiecesNoTargets: typeof redFriendlyBattlePieces = JSON.parse(JSON.stringify(redFriendlyBattlePieces));

        // Add the targets (same way added battlePieces above) (should be in same order with the array)
        for (let x = 0; x < blueBattleEventItems.length; x++) {
            if (blueBattleEventItems[x].targetPieceId !== null) {
                blueFriendlyBattlePieces[x].targetPiece = {
                    pieceId: blueBattleEventItems[x].targetPieceId,
                    pieceTypeId: blueBattleEventItems[x].targetPieceTypeId,
                    piecePositionId: blueBattleEventItems[x].targetPiecePositionId
                };
            }
        }
        for (let y = 0; y < redBattleEventItems.length; y++) {
            if (redBattleEventItems[y].targetPieceId !== null) {
                redFriendlyBattlePieces[y].targetPiece = {
                    pieceId: redBattleEventItems[y].targetPieceId,
                    pieceTypeId: redBattleEventItems[y].targetPieceTypeId,
                    piecePositionId: redBattleEventItems[y].targetPiecePositionId
                };
            }
        }

        // Get the targetIndex if applicable
        for (let z = 0; z < blueFriendlyBattlePieces.length; z++) {
            if (blueFriendlyBattlePieces[z].targetPiece != null) {
                const { pieceId } = blueFriendlyBattlePieces[z].targetPiece;
                blueFriendlyBattlePieces[z].targetPieceIndex = redFriendlyBattlePieces.findIndex(
                    enemyPieceThing => enemyPieceThing.piece.pieceId === pieceId
                );
            }
        }
        for (let z = 0; z < redFriendlyBattlePieces.length; z++) {
            if (redFriendlyBattlePieces[z].targetPiece != null) {
                const { pieceId } = redFriendlyBattlePieces[z].targetPiece;
                redFriendlyBattlePieces[z].targetPieceIndex = blueFriendlyBattlePieces.findIndex(
                    enemyPieceThing => enemyPieceThing.piece.pieceId === pieceId
                );
            }
        }

        return {
            blueFriendlyBattlePieces,
            blueFriendlyBattlePiecesNoTargets,
            redFriendlyBattlePieces,
            redFriendlyBattlePiecesNoTargets
        };
    }

    /**
     * Get the next battle from the battleQueue.
     */
    static async getNext(gameId: GameType['gameId']) {
        const queryString = 'SELECT * FROM battleQueue WHERE battleGameId = ? ORDER BY battleId ASC LIMIT 1';
        const inserts = [gameId];
        const [battles] = await pool.query<RowDataPacket[] & BattleQueueType[]>(queryString, inserts);

        if (battles.length !== 1) {
            // was limiting 1 from query, so should be 1 or 0
            return null;
        }

        const thisBattle = new Battle(battles[0].battleId, battles[0]); // don't need to init, already got all the info from first query
        return thisBattle;
    }

    /**
     * Insert battles as a bulk insert sql query.
     */
    static async bulkInsertBattles(allInserts: number[][]) {
        const queryString = 'INSERT INTO battleQueue (battleGameId, battlePosA, battlePosB) VALUES ?';
        const inserts = [allInserts];
        await pool.query(queryString, inserts);
    }

    /**
     * Insert battlePieces as a bulk insert sql query.
     */
    static async bulkInsertItems(gameId: GameType['gameId'], allInserts: any) {
        const conn = await pool.getConnection();

        let queryString = 'INSERT INTO battleItemsTemp (battlePieceId, gameId, battlePosA, battlePosB) VALUES ?';
        let inserts = [allInserts];
        await conn.query(queryString, inserts);

        queryString =
            'INSERT INTO battlePieces (battleId, battlePieceId) SELECT battleId, battlePieceId FROM battleItemsTemp NATURAL JOIN battleQueue WHERE battleItemsTemp.battlePosA = battleQueue.battlePosA AND battleItemsTemp.battlePosB = battleQueue.battlePosB AND battleItemsTemp.gameId = battleQueue.battleGameId';
        await conn.query(queryString);

        queryString = 'DELETE FROM battleItemsTemp WHERE gameId = ?';
        inserts = [gameId];
        await conn.query(queryString, inserts);

        conn.release();
    }

    /**
     * Update battleItem's targets with a bulk insert and update using a temp table.
     */
    async bulkUpdateTargets(piecesWithTargets: any) {
        // TODO: make sure that these piece->targets make sense (prevent bad targetting? (if possible...))
        if (piecesWithTargets.length > 0) {
            const allInserts = [];
            for (let x = 0; x < piecesWithTargets.length; x++) {
                const { piece, targetPiece } = piecesWithTargets[x];
                const newInsert = [this.battleId, piece.pieceId, targetPiece == null ? -1 : targetPiece.pieceId, this.battleGameId];
                allInserts.push(newInsert);
            }

            let queryString = 'INSERT INTO battleItemsTargetsTemp (battleId, battlePieceId, battlePieceTargetId, gameId) VALUES ?';
            const inserts = [allInserts];
            await pool.query(queryString, inserts);

            queryString =
                'UPDATE battlePieces, battleItemsTargetsTemp SET battlePieces.battlePieceTargetId = battleItemsTargetsTemp.battlePieceTargetId WHERE battlePieces.battleId = battleItemsTargetsTemp.battleId AND battlePieces.battlePieceId = battleItemsTargetsTemp.battlePieceId';
            await pool.query(queryString);

            queryString = 'DELETE FROM battleItemsTargetsTemp WHERE gameId = ?';
            const inserts2 = [this.battleGameId];
            await pool.query(queryString, inserts2);
        }
    }

    /**
     * Using battleItem targets, perform dice rolls between pieces and determine success or failure.
     */
    async fight() {
        type subQueryType = {
            attackPieceId: PieceType['pieceId'];
            attackPieceTypeId: PieceType['pieceTypeId'];
            targetPieceId: PieceType['pieceId'] | null;
            targetPiecePositionId: PieceType['piecePositionId'] | null;
            targetPieceTypeId: PieceType['pieceTypeId'] | null;
        };

        let queryString =
            'SELECT pieceId as attackPieceId, pieceTypeId as attackPieceTypeId, tpieceId as targetPieceId, tpieceTypeId as targetPieceTypeId, tpiecePositionId as targetPiecePositionId FROM (SELECT battlePieceTargetId, pieceId, pieceTypeId FROM battlePieces NATUAL JOIN pieces WHERE battlePieceId = pieceId AND battleId = ?) a LEFT JOIN (SELECT pieceId as tpieceId, pieceTypeId as tpieceTypeId, piecePositionId as tpiecePositionId FROM pieces) b ON a.battlePieceTargetId = b.tpieceId';
        let inserts = [this.battleId];
        const [battlePiecesWithTargets] = await pool.query<RowDataPacket[] & subQueryType[]>(queryString, inserts);

        let atLeastOneTarget = false;
        for (let t = 0; t < battlePiecesWithTargets.length; t++) {
            if (battlePiecesWithTargets[t].targetPieceId != null) {
                atLeastOneTarget = true;
                break;
            }
        }

        if (!atLeastOneTarget) {
            return null;
        }

        const piecesToDelete: PieceType['pieceId'][] = [];
        const masterRecord: MasterRecordType = [];

        for (let x = 0; x < battlePiecesWithTargets.length; x++) {
            const { attackPieceId, attackPieceTypeId, targetPieceId, targetPieceTypeId, targetPiecePositionId } = battlePiecesWithTargets[x];

            if (targetPieceId == null || targetPieceTypeId == null) {
                masterRecord.push({
                    attackPieceId,
                    targetPieceId: null
                });
                continue;
            }

            const neededValue = ATTACK_MATRIX[attackPieceTypeId][targetPieceTypeId];
            const diceRoll1 = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
            const diceRoll2 = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
            // const diceRoll1 = 1 as 1 | 2 | 3 | 4 | 5 | 6; // for testing
            // const diceRoll2 = 1 as 1 | 2 | 3 | 4 | 5 | 6;
            const diceRollValue = diceRoll1 + diceRoll2;

            const newRecord = {
                attackPieceId,
                targetPieceId,
                diceRoll1,
                diceRoll2
            };

            if (diceRollValue < neededValue || ATTACK_MATRIX[attackPieceTypeId][targetPieceTypeId] === UNABLE_TO_HIT) {
                masterRecord.push({
                    ...newRecord,
                    win: false
                });
                continue;
            }

            masterRecord.push({
                ...newRecord,
                win: true,
                targetPiecePositionId // will need to know where on the board to delete it (helper value)
            });
            piecesToDelete.push(targetPieceId);
        }

        if (piecesToDelete.length !== 0) {
            queryString = 'DELETE FROM pieces WHERE pieceId IN (?)';
            const inserts2 = [piecesToDelete];
            await pool.query(queryString, inserts2);
        }

        // prevents seeing previous attack from refresh*
        // TODO: could store results with just 1 extra field on battlePieces, already storing the target....(but would need to delete actual pieces/targets after 'confirm' the results....)
        queryString = 'UPDATE battlePieces SET battlePieceTargetId = -1 WHERE battleId = ?';
        inserts = [this.battleId];
        await pool.query(queryString, inserts);

        return masterRecord;
    }
}
