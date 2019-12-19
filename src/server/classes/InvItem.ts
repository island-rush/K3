import { TYPE_FUEL, TYPE_MOVES } from "../../react-client/src/constants/gameConstants";
import { InvItemType } from "../../react-client/src/constants/interfaces";
import pool from "../database";
import Piece from "./Piece";

/**
 * Represents row in invItems table in the database.
 */
class InvItem implements InvItemType {
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
        const queryString = "SELECT * FROM invItems WHERE invItemId = ?";
        const inserts = [this.invItemId];
        const [results, fields] = await pool.query(queryString, inserts);

        if (results.length != 1) {
            return null;
        } else {
            Object.assign(this, results[0]);
            return this;
        }
    }

    /**
     * Delete this inv item.
     */
    async delete() {
        const queryString = "DELETE FROM invItems WHERE invItemId = ?";
        const inserts = [this.invItemId];
        await pool.query(queryString, inserts);
    }

    //TODO: this looks weird, could convert to object parameter to explicitly say what is what (similar to game add)
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
            "INSERT INTO invItems (invItemId, invItemGameId, invItemTeamId, invItemTypeId) SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
        const inserts = [gameId, gameTeam];
        await pool.query(queryString, inserts);
    }

    /**
     * Get all invItems from the database for this game's team.
     */
    static async all(gameId: number, gameTeam: number) {
        const queryString = "SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?";
        const inserts = [gameId, gameTeam];
        const [invItems] = await pool.query(queryString, inserts);
        return invItems as InvItemType[];
    }
}

export default InvItem;
