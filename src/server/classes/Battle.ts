import { RowDataPacket } from 'mysql2/promise';
import { ATTACK_MATRIX, PIECES_WITH_FUEL } from '../../constants';
import { BattleItemType, BattleQueueType, PieceType, GameType, BlueOrRedTeamId } from '../../types';
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
        const queryString3 = 'SELECT pieceId FROM battleItems JOIN pieces ON pieceId = battlePieceId WHERE pieceTypeId IN (?) AND battleId = ?';
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
     * Get sql array of battleItems/pieces that are tied to this battle.
     */
    async getItems() {
        const queryString = 'SELECT * FROM battleItems NATURAL JOIN pieces WHERE battleId = ? AND battlePieceId = pieceId';
        const inserts = [this.battleId];
        const [battleItems] = await pool.query<RowDataPacket[] & BattleItemType[]>(queryString, inserts);

        if (battleItems.length === 0) {
            return null;
        }

        return battleItems;
    }

    /**
     * getItems() but for a specific team.
     */
    async getTeamItems(gameTeam: BlueOrRedTeamId) {
        const queryString =
            'SELECT * FROM (SELECT * FROM battleItems NATUAL JOIN pieces WHERE battlePieceId = pieceId AND battleId = ? AND pieceTeamId = ?) a LEFT JOIN (SELECT pieceId as tpieceId, pieceGameId as tpieceGameId, pieceTeamId as tpieceTeamId, pieceTypeId as tpieceTypeId, piecePositionId as tpiecePositionId, pieceContainerId as tpieceContainerId, pieceVisible as tpieceVisible, pieceMoves as tpieceMoves, pieceFuel as tpieceFuel FROM pieces) b ON a.battlePieceTargetId = b.tpieceId';
        const inserts = [this.battleId, gameTeam];
        const [battleTeamItems] = await pool.query<RowDataPacket[]>(queryString, inserts); // TODO: weird data type here
        return battleTeamItems; // TODO: do we need to return null explicitly? (this is an empty array ^^^ see getItems for difference (not sure why needed))
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
     * Insert battleItems as a bulk insert sql query.
     */
    static async bulkInsertItems(gameId: GameType['gameId'], allInserts: any) {
        const conn = await pool.getConnection();

        let queryString = 'INSERT INTO battleItemsTemp (battlePieceId, gameId, battlePosA, battlePosB) VALUES ?';
        let inserts = [allInserts];
        await conn.query(queryString, inserts);

        queryString =
            'INSERT INTO battleItems (battleId, battlePieceId) SELECT battleId, battlePieceId FROM battleItemsTemp NATURAL JOIN battleQueue WHERE battleItemsTemp.battlePosA = battleQueue.battlePosA AND battleItemsTemp.battlePosB = battleQueue.battlePosB AND battleItemsTemp.gameId = battleQueue.battleGameId';
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
                'UPDATE battleItems, battleItemsTargetsTemp SET battleItems.battlePieceTargetId = battleItemsTargetsTemp.battlePieceTargetId WHERE battleItems.battleId = battleItemsTargetsTemp.battleId AND battleItems.battlePieceId = battleItemsTargetsTemp.battlePieceId';
            await pool.query(queryString);

            queryString = 'DELETE FROM battleItemsTargetsTemp WHERE gameId = ?';
            const inserts2 = [this.battleGameId];
            await pool.query(queryString, inserts2);
        }
    }

    // prettier-ignore
    /**
     * Using battleItem targets, perform dice rolls between pieces and determine success or failure.
     */
    async fight() {
        let queryString = 'SELECT * FROM (SELECT * FROM battleItems NATUAL JOIN pieces WHERE battlePieceId = pieceId AND battleId = ?) a LEFT JOIN (SELECT pieceId as tpieceId, pieceGameId as tpieceGameId, pieceTeamId as tpieceTeamId, pieceTypeId as tpieceTypeId, piecePositionId as tpiecePositionId, pieceContainerId as tpieceContainerId, pieceVisible as tpieceVisible, pieceMoves as tpieceMoves, pieceFuel as tpieceFuel FROM pieces) b ON a.battlePieceTargetId = b.tpieceId';
        let inserts = [this.battleId];
        const [battleItemsWithTargets] = await pool.query<RowDataPacket[]>(queryString, inserts); // TODO: weird datatype here

        // need to know if any battles, and if 0 battles, end the battle
        let atLeastOneBattle = false;
        for (let t = 0; t < battleItemsWithTargets.length; t++) {
            // assume that anything inserted into the database was legit (that piece had valid attack...etc)
            if (battleItemsWithTargets[t].tpieceId != null) {
                atLeastOneBattle = true;
                break;
            }
        }

        const fightResults: any = {
            atLeastOneBattle
        };

        if (atLeastOneBattle) {
            const piecesToDelete = [-1]; // need at least 1 value for sql to work?
            const masterRecord = []; // for the client to handle...(future may do more things for client in advance...)

            for (let x = 0; x < battleItemsWithTargets.length; x++) {
                const thisBattleItem = battleItemsWithTargets[x];
                const { pieceId, pieceTypeId, tpieceId, tpieceTypeId } = thisBattleItem;
                // is there a target?
                if (tpieceId == null) {
                    // nothing new, no dice...
                    masterRecord.push({
                        pieceId,
                        targetId: null, // probably not needed....
                        diceRoll: null,
                        win: false
                    });
                } else {
                    // do a dice roll
                    // figure out needed value for success
                    const neededValue = ATTACK_MATRIX[pieceTypeId][tpieceTypeId];
                    const diceRolledResult1 = Math.floor(Math.random() * 6) + 1;
                    // const diceRolledResult1 = 1;
                    const diceRolledResult2 = Math.floor(Math.random() * 6) + 1;
                    // const diceRolledResult2 = 1;
                    const diceRollValue = diceRolledResult1 + diceRolledResult2;

                    // > or >=?
                    if (diceRollValue >= neededValue && neededValue !== 0) {
                        // something happens!, show dice, highlight probably
                        // bulk update add? //bulk delete?
                        piecesToDelete.push(tpieceId);
                        masterRecord.push({
                            pieceId,
                            diceRoll: diceRollValue,
                            targetId: tpieceId,
                            win: true,
                            diceRoll1: diceRolledResult1,
                            diceRoll2: diceRolledResult2
                        });
                    } else {
                        // nothing happens, show dice, don't highlight?
                        masterRecord.push({
                            pieceId,
                            diceRoll: diceRollValue,
                            targetId: tpieceId,
                            win: false,
                            diceRoll1: diceRolledResult1,
                            diceRoll2: diceRolledResult2
                        });
                    }
                }
            }

            // delete pieces if they are in the array (BULK DELETE QUERY)
            // TODO: move this functionality to the piece class?
            queryString = 'DELETE FROM pieces WHERE pieceId IN (?)';
            const inserts2 = [piecesToDelete];
            await pool.query(queryString, inserts2);

            // prevents seeing previous attack from refresh*
            queryString = 'UPDATE battleItems SET battlePieceTargetId = -1 WHERE battleId = ?';
            inserts = [this.battleId];
            await pool.query(queryString, inserts);

            // need to return the master record? and something else?
            fightResults.masterRecord = masterRecord;
        }

        return fightResults;
    }
}
