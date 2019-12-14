import pool from "../database";
import { FieldPacket } from "mysql2";

interface ShopItem {
    shopItemId: number;
    shopItemGameId: number;
    shopItemTeamId: number;
    shopItemTypeId: number;
}

class ShopItem {
    constructor(shopItemId: number) {
        this.shopItemId = shopItemId;
    }

    async init() {
        const queryString = "SELECT * FROM shopItems WHERE shopItemId = ?";
        const inserts = [this.shopItemId];
        const [results, fields]: [any[], FieldPacket[]] = await pool.query(queryString, inserts);

        if (results.length != 1) {
            return null;
        } else {
            Object.assign(this, results[0]);
            return this;
        }
    }

    async delete() {
        // await ShopItem.delete(this.shopItemId);
        const queryString = "DELETE FROM shopItems WHERE shopItemId = ?";
        const inserts = [this.shopItemId];
        await pool.query(queryString, inserts);
    }

    static async insert(shopItemGameId: number, shopItemTeamId: number, shopItemTypeId: number) {
        const queryString = "INSERT INTO shopItems (shopItemGameId, shopItemTeamId, shopItemTypeId) values (?, ?, ?)";
        const inserts = [shopItemGameId, shopItemTeamId, shopItemTypeId];
        const [results, fields] = await pool.query(queryString, inserts);
        // console.log(results);
        const thisShopItem = new ShopItem(results.insertId); //TODO: this could fail, need to handle that error (rare tho)
        Object.assign(thisShopItem, {
            shopItemGameId,
            shopItemTeamId,
            shopItemTypeId
        });
        return thisShopItem;
    }

    static async deleteAll(gameId: number, gameTeam: number) {
        const queryString = "DELETE FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
        const inserts = [gameId, gameTeam];
        await pool.query(queryString, inserts);
    }

    static async all(gameId: number, gameTeam: number) {
        const queryString = "SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
        const inserts = [gameId, gameTeam];
        const [shopItems] = await pool.query(queryString, inserts);
        return shopItems;
    }
}

export default ShopItem;
