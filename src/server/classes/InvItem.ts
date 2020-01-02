import { RowDataPacket } from 'mysql2/promise';
import { Piece } from './Piece';
import { TYPE_FUEL, TYPE_MOVES } from '../../constants';
import { InvItemType } from '../../types';
import { pool } from '../database';

/**
 * Represents row in invItems table in the database.
 */
export class InvItem implements InvItemType {
    invItemId: number;

    invItemGameId: number;

    invItemTeamId: number;

    invItemTypeId: number;

    constructor(invItemId: number) {
        this.invItemId = invItemId;
    }

    /**
     * Get information from database about this inv item.
     */
    async init() {
        const queryString = 'SELECT * FROM invItems WHERE invItemId = ?';
        const inserts = [this.invItemId];
        const [results] = await pool.query<RowDataPacket[] & InvItemType[]>(queryString, inserts);

        if (results.length !== 1) {
            return null;
        }
        Object.assign(this, results[0]);
        return this;
    }

    /**
     * Delete this inv item.
     */
    async delete() {
        const queryString = 'DELETE FROM invItems WHERE invItemId = ?';
        const inserts = [this.invItemId];
        await pool.query(queryString, inserts);
    }

    // TODO: this looks weird, could convert to object parameter to explicitly say what is what (similar to game add)
    /**
     * Move inv item from the inventory and put it on the board as a piece.
     */
    async placeOnBoard(selectedPosition: number) {
        const newPiece = await Piece.insert(
            this.invItemGameId,
            this.invItemTeamId,
            this.invItemTypeId,
            selectedPosition,
            -1,
            0,
            TYPE_MOVES[this.invItemTypeId],
            TYPE_FUEL[this.invItemTypeId]
        );

        await this.delete();

        return newPiece;
    }

    /**
     * Take all shopItems and create invItems from them.
     */
    static async insertFromShop(gameId: number, gameTeam: number) {
        const queryString =
            'INSERT INTO invItems (invItemId, invItemGameId, invItemTeamId, invItemTypeId) SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?';
        const inserts = [gameId, gameTeam];
        await pool.query(queryString, inserts);
    }

    /**
     * Get all invItems from the database for this game's team.
     */
    static async all(gameId: number, gameTeam: number) {
        const queryString = 'SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?';
        const inserts = [gameId, gameTeam];
        const [invItems] = await pool.query<RowDataPacket[] & InvItemType[]>(queryString, inserts);
        return invItems;
    }
}
