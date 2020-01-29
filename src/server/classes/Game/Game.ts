// prettier-ignore
import { OkPacket, RowDataPacket } from 'mysql2/promise';
// prettier-ignore
import { ALL_AIRFIELD_LOCATIONS, ALL_FLAG_LOCATIONS, BLUE_TEAM_ID, CAPTURE_TYPES, DRAGON_ISLAND_ID, EAGLE_ISLAND_ID, FULLER_ISLAND_ID, HR_REPUBLIC_ISLAND_ID, ISLAND_POINTS, KEONI_ISLAND_ID, LION_ISLAND_ID, MONTAVILLE_ISLAND_ID, NOYARC_ISLAND_ID, RED_TEAM_ID, RICO_ISLAND_ID, SHOR_ISLAND_ID, TAMU_ISLAND_ID } from '../../../constants';
import { GameType, NewsState, PieceType } from '../../../types';
import { gameInitialNews, gameInitialPieces } from '../../admin';
import { pool } from '../../database';
import { GameProperties } from './GameProperties';
import { initialStateAction } from './initialStateAction';

/**
 * Represents a row in the games table in the database.
 */
export class Game extends GameProperties implements GameType {
    static async getId(gameSection: GameType['gameSection'], gameInstructor: GameType['gameInstructor']) {
        const queryString = 'SELECT * FROM games WHERE gameSection = ? AND gameInstructor = ?';
        const inserts = [gameSection, gameInstructor];
        const [results] = await pool.query<RowDataPacket[] & GameType[]>(queryString, inserts);

        if (results.length !== 1) {
            return null;
        }

        return results[0].gameId;
    }

    /**
     * Get information about the game from the database.
     */
    async init() {
        const queryString = 'SELECT * FROM games WHERE gameId = ?';
        const inserts = [this.gameId];
        const [results] = await pool.query<RowDataPacket[] & GameType[]>(queryString, inserts);

        if (results.length !== 1) {
            return null;
        }

        Object.assign(this, results[0]);
        return this;
    }

    /**
     * Delete old news, and get next news alert from database.
     */
    async getNextNews() {
        // Delete the old news
        let queryString = 'DELETE FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1';
        const inserts = [this.gameId];
        await pool.query(queryString, inserts);

        type SubNewsType = {
            newsTitle: string;
            newsInfo: string;
        };

        // Grab the next news
        queryString = 'SELECT newsTitle, newsInfo FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1';
        const [resultNews] = await pool.query<RowDataPacket[] & SubNewsType[]>(queryString, inserts);

        const { newsTitle, newsInfo } =
            resultNews[0] !== undefined
                ? resultNews[0]
                : { newsTitle: 'No More News', newsInfo: "Obviously you've been playing this game too long..." };

        return {
            isMinimized: false,
            active: true,
            newsTitle,
            newsInfo
        } as NewsState;
    }

    /**
     * Globally (for this game), give points to teams based on flags that they own.
     */
    async addPoints() {
        // add points based on the island ownerships inside this object (game)
        let bluePoints = this.gameBluePoints;
        let redPoints = this.gameRedPoints;

        bluePoints += this.flag0 === this.flag1 && this.flag0 === BLUE_TEAM_ID ? ISLAND_POINTS[DRAGON_ISLAND_ID] : 0;
        redPoints += this.flag0 === this.flag1 && this.flag0 === RED_TEAM_ID ? ISLAND_POINTS[DRAGON_ISLAND_ID] : 0;

        bluePoints += this.flag2 === BLUE_TEAM_ID ? ISLAND_POINTS[HR_REPUBLIC_ISLAND_ID] : 0;
        redPoints += this.flag2 === RED_TEAM_ID ? ISLAND_POINTS[HR_REPUBLIC_ISLAND_ID] : 0;

        bluePoints += this.flag3 === BLUE_TEAM_ID ? ISLAND_POINTS[MONTAVILLE_ISLAND_ID] : 0;
        redPoints += this.flag3 === RED_TEAM_ID ? ISLAND_POINTS[MONTAVILLE_ISLAND_ID] : 0;

        bluePoints += this.flag4 === BLUE_TEAM_ID ? ISLAND_POINTS[LION_ISLAND_ID] : 0;
        redPoints += this.flag4 === RED_TEAM_ID ? ISLAND_POINTS[LION_ISLAND_ID] : 0;

        bluePoints += this.flag5 === BLUE_TEAM_ID ? ISLAND_POINTS[NOYARC_ISLAND_ID] : 0;
        redPoints += this.flag5 === RED_TEAM_ID ? ISLAND_POINTS[NOYARC_ISLAND_ID] : 0;

        bluePoints += this.flag6 === BLUE_TEAM_ID ? ISLAND_POINTS[FULLER_ISLAND_ID] : 0;
        redPoints += this.flag6 === RED_TEAM_ID ? ISLAND_POINTS[FULLER_ISLAND_ID] : 0;

        bluePoints += this.flag7 === BLUE_TEAM_ID ? ISLAND_POINTS[RICO_ISLAND_ID] : 0;
        redPoints += this.flag7 === RED_TEAM_ID ? ISLAND_POINTS[RICO_ISLAND_ID] : 0;

        bluePoints += this.flag8 === BLUE_TEAM_ID ? ISLAND_POINTS[TAMU_ISLAND_ID] : 0;
        redPoints += this.flag8 === RED_TEAM_ID ? ISLAND_POINTS[TAMU_ISLAND_ID] : 0;

        bluePoints += this.flag9 === BLUE_TEAM_ID ? ISLAND_POINTS[SHOR_ISLAND_ID] : 0;
        redPoints += this.flag9 === RED_TEAM_ID ? ISLAND_POINTS[SHOR_ISLAND_ID] : 0;

        bluePoints += this.flag10 === BLUE_TEAM_ID ? ISLAND_POINTS[KEONI_ISLAND_ID] : 0;
        redPoints += this.flag10 === RED_TEAM_ID ? ISLAND_POINTS[KEONI_ISLAND_ID] : 0;

        bluePoints += this.flag11 === this.flag12 && this.flag11 === BLUE_TEAM_ID ? ISLAND_POINTS[EAGLE_ISLAND_ID] : 0;
        redPoints += this.flag11 === this.flag12 && this.flag11 === RED_TEAM_ID ? ISLAND_POINTS[EAGLE_ISLAND_ID] : 0;

        await this.setPoints(BLUE_TEAM_ID, bluePoints);
        await this.setPoints(RED_TEAM_ID, redPoints);
    }

    /**
     * Delete this game.
     */
    async delete() {
        const queryString = 'DELETE FROM games WHERE gameId = ?';
        const inserts = [this.gameId];
        await pool.query(queryString, inserts);
    }

    /**
     * Set the admin password for a specific game.
     */
    async setAdminPassword(gameAdminPasswordHash: string) {
        const queryString = 'UPDATE games SET gameAdminPassword = ? WHERE gameId = ?';
        const inserts = [gameAdminPasswordHash, this.gameId];
        await pool.query(queryString, inserts);
        Object.assign(this, { gameAdminPassword: gameAdminPasswordHash });
    }

    /**
     * Set team passwords for a specific game.
     */
    async setTeamPasswords(gameBluePasswordHash: string, gameRedPasswordHash: string) {
        const queryString = 'UPDATE games SET gameBluePassword = ?, gameRedPassword = ? WHERE gameId = ?';
        const inserts = [gameBluePasswordHash, gameRedPasswordHash, this.gameId];
        await pool.query(queryString, inserts);
        Object.assign(this, { gameBluePassword: gameBluePasswordHash, gameRedPassword: gameRedPasswordHash });
    }

    /**
     * Get a sql array of news alerts for this game.
     */
    static async getAllNews(gameId: number) {
        const queryString = 'SELECT * FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC';
        const inserts = [gameId];
        type NewsType = {
            newsId: number;
            newsGameId: number;
            newsOrder: number;
            newsTitle: string;
            newsInfo: string;
        };
        const [rows] = await pool.query<RowDataPacket[] & NewsType[]>(queryString, inserts);
        return rows;
    }

    /**
     * Set a new value for gameActive in this game.
     */
    async setGameActive(newValue: number) {
        const queryString =
            'UPDATE games SET gameActive = ?, gameBlueController0 = 0, gameBlueController1 = 0, gameBlueController2 = 0, gameBlueController3 = 0, gameBlueController4 = 0, gameRedController0 = 0, gameRedController1 = 0, gameRedController2 = 0, gameRedController3 = 0, gameRedController4 = 0 WHERE gameId = ?';
        const inserts = [newValue, this.gameId];
        await pool.query(queryString, inserts);
        const updatedInfo = {
            gameActive: newValue,
            gameBlueController0: 0,
            gameBlueController1: 0,
            gameBlueController2: 0,
            gameBlueController3: 0,
            gameBlueController4: 0,
            gameRedController0: 0,
            gameRedController1: 0,
            gameRedController2: 0,
            gameRedController3: 0,
            gameRedController4: 0
        };
        Object.assign(this, updatedInfo);
    }

    /**
     * Set loggedIn value for a specific team/controller in this game.
     */
    async setLoggedIn(gameTeam: number, gameController: number, value: number) {
        const queryString = 'UPDATE games SET ?? = ? WHERE gameId = ?';
        const inserts = [`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Controller${gameController}`, value, this.gameId];
        await pool.query(queryString, inserts);
        this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Controller${gameController}`] = value;
    }

    /**
     * Reset a game back to the initial, pre-defined state.
     */
    async reset() {
        await this.delete();
        await Game.add(this.gameSection, this.gameInstructor, this.gameAdminPassword, { gameId: this.gameId });
    }

    /**
     * Add a new game to the database.
     */
    static async add(
        gameSection: GameType['gameSection'],
        gameInstructor: GameType['gameInstructor'],
        gameAdminPasswordHash: GameType['gameAdminPassword'],
        options: { gameId?: GameType['gameId'] } = {}
    ) {
        let queryString: string;
        let inserts:
            | [
                  GameType['gameId'],
                  GameType['gameSection'],
                  GameType['gameInstructor'],
                  GameType['gameAdminPassword'],
                  GameType['gameSection'],
                  GameType['gameInstructor']
              ]
            | [
                  GameType['gameSection'],
                  GameType['gameInstructor'],
                  GameType['gameAdminPassword'],
                  GameType['gameSection'],
                  GameType['gameInstructor']
              ];

        if (options.gameId) {
            queryString =
                'INSERT INTO games (gameId, gameSection, gameInstructor, gameAdminPassword) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT * from games WHERE gameSection=? AND gameInstructor = ?)';
            inserts = [options.gameId, gameSection, gameInstructor, gameAdminPasswordHash, gameSection, gameInstructor];
        } else {
            queryString =
                'INSERT INTO games (gameSection, gameInstructor, gameAdminPassword) SELECT ?,?,? WHERE NOT EXISTS(SELECT * from games WHERE gameSection=? AND gameInstructor = ?)';
            inserts = [gameSection, gameInstructor, gameAdminPasswordHash, gameSection, gameInstructor];
        }

        const [result] = await pool.query<OkPacket>(queryString, inserts);

        if (result.affectedRows === 0) return null;

        const gameIdFromSearch = await Game.getId(gameSection, gameInstructor); // TODO: should check for null? (we just inserted it tho)
        const thisGame = await new Game(gameIdFromSearch).init();

        await gameInitialPieces(thisGame.gameId);
        await gameInitialNews(thisGame.gameId);

        return thisGame;
    }

    /**
     * Set the points for a specific team in this game.
     */
    async setPoints(gameTeam: number, newPoints: number) {
        // TODO: could have a type alias for gameTeam since we use it a lot? (always ensure it is 'number' -> instead of manually always making it a 'number')
        const queryString = 'UPDATE games SET ?? = ? WHERE gameId = ?';
        const inserts = [`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Points`, newPoints, this.gameId];
        await pool.query(queryString, inserts);
        this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Points`] = newPoints;
    }

    /**
     * Set the status for a specific team in this game.
     */
    async setStatus(gameTeam: number, newStatus: number) {
        const queryString = 'UPDATE games set ?? = ? WHERE gameId = ?';
        const inserts = [`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Status`, newStatus, this.gameId];
        await pool.query(queryString, inserts);
        this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Status`] = newStatus;
    }

    /**
     * Set the gamePhase value in this game.
     */
    async setPhase(newGamePhase: number) {
        const queryString = 'UPDATE games set gamePhase = ? WHERE gameId = ?';
        const inserts = [newGamePhase, this.gameId];
        await pool.query(queryString, inserts);
        this.gamePhase = newGamePhase;
    }

    /**
     * Set the gameSlice value in this game.
     *
     * gameSlice => planning or executing
     */
    async setSlice(newGameSlice: number) {
        const queryString = 'UPDATE games SET gameSlice = ? WHERE gameId = ?';
        const inserts = [newGameSlice, this.gameId];
        await pool.query(queryString, inserts);
        this.gameSlice = newGameSlice;
    }

    /**
     * Set the gameRound value in this game.
     *
     * Usually 1, 2, or 3
     */
    async setRound(newGameRound: number) {
        const queryString = 'UPDATE games SET gameRound = ? WHERE gameId = ?';
        const inserts = [newGameRound, this.gameId];
        await pool.query(queryString, inserts);
        this.gameRound = newGameRound;
    }

    /**
     * Globally (in this game), calculate who own's which flag based on pieces that exist on those positions.
     */
    async updateFlags() {
        // only certain pieces can capture
        // see if any pieces are currently residing on flags by themselves, and if so, set the island# in the database and update 'this' object correspondingly
        let queryString = 'SELECT * FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?) AND pieceTypeId in (?)';
        const inserts = [this.gameId, ALL_FLAG_LOCATIONS, CAPTURE_TYPES];
        const [results] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);

        if (results.length === 0) {
            return false;
        }

        // need to set all positions that have pieces on them (that are different from current values?)
        // update if only 1 team's pieces there, AND if not already the other team? (or update anyway if all 1 team)

        // TODO: need major refactoring here, this is quick and dirty (but should work)
        const eachFlagsTeams: number[][] = [[], [], [], [], [], [], [], [], [], [], [], [], []];
        for (let x = 0; x < results.length; x++) {
            const thisPiece = results[x];
            const { piecePositionId, pieceTeamId } = thisPiece;
            const flagNum = ALL_FLAG_LOCATIONS.indexOf(piecePositionId);
            eachFlagsTeams[flagNum].push(pieceTeamId);
        }

        let didUpdateFlags = false;

        for (let y = 0; y < eachFlagsTeams.length; y++) {
            const thisFlagsTeams = eachFlagsTeams[y];
            if (thisFlagsTeams.length === 0) continue;
            if (thisFlagsTeams.includes(BLUE_TEAM_ID) && thisFlagsTeams.includes(RED_TEAM_ID)) continue;
            // else update this thing
            this.setFlag(y, thisFlagsTeams[0]);
            // sql update
            queryString = 'UPDATE games SET ?? = ? WHERE gameId = ?';
            const inserts = [`flag${y}`, thisFlagsTeams[0], this.gameId];
            await pool.query(queryString, inserts);
            didUpdateFlags = true;
        }

        return didUpdateFlags;
    }

    async updateAirfields() {
        const queryString = 'SELECT * FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?) AND pieceTypeId in (?)';
        const inserts = [this.gameId, ALL_AIRFIELD_LOCATIONS, CAPTURE_TYPES];
        const [results] = await pool.query<RowDataPacket[] & PieceType[]>(queryString, inserts);

        if (results.length === 0) {
            return false;
        }

        // loop through pieces, decide if any airfield should change ownership

        const eachAirfieldTeams: number[][] = [[], [], [], [], [], [], [], [], [], []];

        for (const thisPiece of results as PieceType[]) {
            const { piecePositionId, pieceTeamId } = thisPiece;
            const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(piecePositionId);
            eachAirfieldTeams[airfieldNum].push(pieceTeamId);
        }

        let didUpdateAirfields = false;

        for (let y = 0; y < eachAirfieldTeams.length; y++) {
            const thisAirfieldTeams = eachAirfieldTeams[y];
            if (thisAirfieldTeams.length === 0) continue;
            if (thisAirfieldTeams.includes(BLUE_TEAM_ID) && thisAirfieldTeams.includes(RED_TEAM_ID)) continue;
            // else update this thing
            this.setAirfield(y, thisAirfieldTeams[0]);
            // sql update
            const queryString = 'UPDATE games SET ?? = ? WHERE gameId = ?';
            const inserts = [`airfield${y}`, thisAirfieldTeams[0], this.gameId];
            await pool.query(queryString, inserts);
            didUpdateAirfields = true;
        }

        return didUpdateAirfields;
    }

    /**
     * Change flag ownership for a certain team.
     */
    setFlag(flagNumber: number, flagValue: GameType['flag0']) {
        this[`flag${flagNumber}`] = flagValue;
    }

    setAirfield(airfieldNumber: number, airfieldValue: GameType['airfield0']) {
        this[`airfield${airfieldNumber}`] = airfieldValue;
    }

    /**
     * Get a sql array of all games.
     * Only includes gameId, gameSection, gameInstructor, gameActive
     */
    static async getGames() {
        const queryString = 'SELECT gameId, gameSection, gameInstructor, gameActive FROM games';
        type SubGameType = {
            gameId: GameType['gameId'];
            gameSection: GameType['gameSection'];
            gameInstructor: GameType['gameInstructor'];
            gameActive: GameType['gameActive'];
        };
        const [rows] = await pool.query<RowDataPacket[] & SubGameType[]>(queryString);
        return rows;
    }

    /**
     * Generates a Redux Action, contains all current game information / state.
     */
    async initialStateAction(gameTeam: number, gameControllers: any) {
        return initialStateAction(this, gameTeam, gameControllers);
    }
}
