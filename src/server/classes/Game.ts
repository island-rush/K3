import pool from "../database";
import { gameInitialPieces, gameInitialNews } from "../admin";
import { Field, RowDataPacket } from "mysql2";

type GameOptions = {
    gameId?: number;
    gameSection?: string;
    gameInstructor?: string;
};

class Game {
    gameId: number;
    gameSection: string;
    gameInstructor: string;

    gameAdminPassword: string;

    gameActive: number;

    game0Password: string;
    game1Password: string;

    game0Controller0: number;
    game0Controller1: number;
    game0Controller2: number;
    game0Controller3: number;
    game0Controller4: number;
    game1Controller0: number;
    game1Controller1: number;
    game1Controller2: number;
    game1Controller3: number;
    game1Controller4: number;

    game0Status: number;
    game1Status: number;

    game0Points: number;
    game1Points: number;

    gamePhase: number;
    gameRound: number;
    gameSlice: number;

    flag0: number;
    flag1: number;
    flag2: number;
    flag3: number;
    flag4: number;
    flag5: number;
    flag6: number;
    flag7: number;
    flag8: number;
    flag9: number;
    flag10: number;
    flag11: number;
    flag12: number;

    constructor(options: GameOptions) {
        if (options.gameId) {
            this.gameId = options.gameId;
        } else if (options.gameSection && options.gameInstructor) {
            this.gameSection = options.gameSection;
            this.gameInstructor = options.gameInstructor;
        }
    }

    async init() {
        let queryString;
        let inserts;

        if (this.gameId) {
            queryString = "SELECT * FROM games WHERE gameId = ?";
            inserts = [this.gameId];
        } else if (this.gameSection && this.gameInstructor) {
            queryString = "SELECT * FROM games WHERE gameSection = ? AND gameInstructor = ?";
            inserts = [this.gameSection, this.gameInstructor];
        }

        const [rows, fields] = await pool.query(queryString, inserts);

        if (rows.length != 1) {
            return null;
        } else {
            Object.assign(this, rows[0]);
            return this;
        }
    }

    async delete() {
        const queryString = "DELETE FROM games WHERE gameId = ?";
        const inserts = [this.gameId];
        await pool.query(queryString, inserts);
    }

    static async getGames() {
        const queryString = "SELECT gameId, gameSection, gameInstructor, gameActive FROM games";
        const [rows, fields] = await pool.query(queryString);
        return rows;
    }

    async setAdminPassword(gameAdminPasswordHash: string) {
        const queryString = "UPDATE games SET gameAdminPassword = ? WHERE gameId = ?";
        const inserts = [gameAdminPasswordHash, this.gameId];
        await pool.query(queryString, inserts);
        Object.assign(this, { gameAdminPassword: gameAdminPasswordHash });
    }

    async setTeamPasswords(game0PasswordHash: string, game1PasswordHash: string) {
        const queryString = "UPDATE games SET game0Password = ?, game1Password = ? WHERE gameId = ?";
        const inserts = [game0PasswordHash, game1PasswordHash, this.gameId];
        await pool.query(queryString, inserts);
        Object.assign(this, { game0Password: game0PasswordHash, game1Password: game1PasswordHash });
    }

    static async getAllNews(gameId: number) {
        const queryString = "SELECT * FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC";
        const inserts = [gameId];
        const [rows, fields] = await pool.query(queryString, inserts);
        return rows;
    }

    async setGameActive(newValue: number) {
        const queryString =
            "UPDATE games SET gameActive = ?, game0Controller0 = 0, game0Controller1 = 0, game0Controller2 = 0, game0Controller3 = 0, game0Controller4 = 0, game1Controller0 = 0, game1Controller1 = 0, game1Controller2 = 0, game1Controller3 = 0, game1Controller4 = 0 WHERE gameId = ?";
        const inserts = [newValue, this.gameId];
        await pool.query(queryString, inserts);
        const updatedInfo = {
            gameActive: newValue,
            game0Controller0: 0,
            game0Controller1: 0,
            game0Controller2: 0,
            game0Controller3: 0,
            game0Controller4: 0,
            game1Controller0: 0,
            game1Controller1: 0,
            game1Controller2: 0,
            game1Controller3: 0,
            game1Controller4: 0
        };
        Object.assign(this, updatedInfo);
    }

    async setLoggedIn(gameTeam: number, gameController: number, value: number) {
        const queryString = "UPDATE games SET ?? = ? WHERE gameId = ?";
        const inserts = ["game" + gameTeam + "Controller" + gameController, value, this.gameId];
        await pool.query(queryString, inserts);
        (this as any)["game" + gameTeam + "Controller" + gameController] = value;
    }

    async reset() {
        await this.delete();
        await Game.add(this.gameSection, this.gameInstructor, this.gameAdminPassword, { gameId: this.gameId });
    }

    //TODO: prevent same section/instructor
    static async add(gameSection: string, gameInstructor: string, gameAdminPasswordHash: string, options: { gameId?: number } = {}) {
        let queryString;
        let inserts;

        if (options.gameId) {
            queryString =
                "INSERT INTO games (gameId, gameSection, gameInstructor, gameAdminPassword) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT * from games WHERE gameSection=? AND gameInstructor = ?)";
            inserts = [options.gameId, gameSection, gameInstructor, gameAdminPasswordHash, gameSection, gameInstructor];
        } else {
            queryString =
                "INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) SELECT ?,?,? WHERE NOT EXISTS(SELECT * from games WHERE gameSection=? AND gameInstructor = ?)";
            inserts = [gameSection, gameInstructor, gameAdminPasswordHash, gameSection, gameInstructor];
        }

        const [rows, fields] = await pool.query(queryString, inserts);
        if (rows[0].affectedRows == 0) return;

        const thisGame = await new Game({ gameSection, gameInstructor }).init(); //could not init, but since we don't know who is using this function, return the full game

        //reset the game when its created, now only need to activate, reset is more in tune with the name (instead of initialize?)
        await gameInitialPieces(thisGame.gameId);
        await gameInitialNews(thisGame.gameId);

        return thisGame;
    }

    async setPoints(gameTeam: number, newPoints: number) {
        const queryString = "UPDATE games SET ?? = ? WHERE gameId = ?";
        const inserts = ["game" + gameTeam + "Points", newPoints, this.gameId];
        await pool.query(queryString, inserts);
        (this as any)["game" + gameTeam + "Points"] = newPoints;
    }

    async setStatus(gameTeam: number, newStatus: number) {
        const queryString = "UPDATE games set ?? = ? WHERE gameId = ?";
        const inserts = ["game" + gameTeam + "Status", newStatus, this.gameId];
        await pool.query(queryString, inserts);
        (this as any)["game" + gameTeam + "Status"] = newStatus;
    }

    async setPhase(newGamePhase: number) {
        const queryString = "UPDATE games set gamePhase = ? WHERE gameId = ?";
        const inserts = [newGamePhase, this.gameId];
        await pool.query(queryString, inserts);
        this.gamePhase = newGamePhase;
    }

    async setSlice(newGameSlice: number) {
        const queryString = "UPDATE games SET gameSlice = ? WHERE gameId = ?";
        const inserts = [newGameSlice, this.gameId];
        await pool.query(queryString, inserts);
        this.gameSlice = newGameSlice;
    }

    async setRound(newGameRound: number) {
        const queryString = "UPDATE games SET gameRound = ? WHERE gameId = ?";
        const inserts = [newGameRound, this.gameId];
        await pool.query(queryString, inserts);
        this.gameRound = newGameRound;
    }
}

export default Game;
