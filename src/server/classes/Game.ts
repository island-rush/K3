// prettier-ignore
import { OkPacket, RowDataPacket } from 'mysql2/promise';
import { Capability, Event, InvItem, Piece, Plan, ShopItem } from '.';
// prettier-ignore
import { AIR_REFUELING_SQUADRON_ID, ALL_FLAG_LOCATIONS, BLUE_TEAM_ID, CAPTURE_TYPES, COL_BATTLE_EVENT_TYPE, DRAGON_ISLAND_ID, EAGLE_ISLAND_ID, FULLER_ISLAND_ID, HR_REPUBLIC_ISLAND_ID, INITIAL_GAMESTATE, ISLAND_POINTS, KEONI_ISLAND_ID, LION_ISLAND_ID, MONTAVILLE_ISLAND_ID, NEWS_PHASE_ID, NOYARC_ISLAND_ID, POS_BATTLE_EVENT_TYPE, RED_TEAM_ID, REFUEL_EVENT_TYPE, RICO_ISLAND_ID, SHOR_ISLAND_ID, TAMU_ISLAND_ID } from '../../constants';
import { GameInitialStateAction, GameType, NewsState, NewsType, PieceType, RefuelState, BattleState } from '../../types';
import { gameInitialNews, gameInitialPieces } from '../admin';
import { pool } from '../database';

/**
 * Represents a row in the games table in the database.
 */
export class Game implements GameType {
    gameId: number;

    gameSection: string;

    gameInstructor: string;

    gameAdminPassword: string;

    gameActive: number;

    gameBluePassword: string;

    gameRedPassword: string;

    gameBlueController0: number;

    gameBlueController1: number;

    gameBlueController2: number;

    gameBlueController3: number;

    gameBlueController4: number;

    gameRedController0: number;

    gameRedController1: number;

    gameRedController2: number;

    gameRedController3: number;

    gameRedController4: number;

    gameBlueStatus: number;

    gameRedStatus: number;

    gameBluePoints: number;

    gameRedPoints: number;

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

    // TODO: refactor with 1 constructor with id, and another static factory method with section/instructor
    constructor(options: GameOptions) {
        if ((options as GameConstructorOptionsWithId).gameId) {
            this.gameId = (options as GameConstructorOptionsWithId).gameId;
        } else {
            this.gameSection = (options as GameConstructorOptionsWithoutId).gameSection;
            this.gameInstructor = (options as GameConstructorOptionsWithoutId).gameInstructor;
        }
    }

    /**
     * Get information about the game from the database.
     */
    async init() {
        let queryString: string;
        let inserts: [GameType['gameId']] | [GameType['gameSection'], GameType['gameInstructor']];

        if (this.gameId) {
            queryString = 'SELECT * FROM games WHERE gameId = ?';
            inserts = [this.gameId];
        } else if (this.gameSection && this.gameInstructor) {
            queryString = 'SELECT * FROM games WHERE gameSection = ? AND gameInstructor = ?';
            inserts = [this.gameSection, this.gameInstructor];
        }

        const [rows] = await pool.query<RowDataPacket[] & GameType[]>(queryString, inserts);

        if (rows.length !== 1) {
            return null;
        }

        Object.assign(this, rows[0]);
        return this;
    }

    /**
     * Method to dynamically grab loggedIn values from this game.
     */
    getLoggedIn(gameTeam: number, gameController: number): number {
        if (gameTeam === 0) {
            if (gameController === 0) {
                return this.gameBlueController0;
            }
            if (gameController === 1) {
                return this.gameBlueController1;
            }
            if (gameController === 2) {
                return this.gameBlueController2;
            }
            if (gameController === 3) {
                return this.gameBlueController3;
            }

            return this.gameBlueController4;
        }
        if (gameController === 0) {
            return this.gameRedController0;
        }
        if (gameController === 1) {
            return this.gameRedController1;
        }
        if (gameController === 2) {
            return this.gameRedController2;
        }
        if (gameController === 3) {
            return this.gameRedController3;
        }
        return this.gameRedController4;
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
        switch (gameTeam) {
            case BLUE_TEAM_ID:
                switch (gameController) {
                    case 0:
                        this.gameBlueController0 = value;
                        break;
                    case 1:
                        this.gameBlueController1 = value;
                        break;
                    case 2:
                        this.gameBlueController2 = value;
                        break;
                    case 3:
                        this.gameBlueController3 = value;
                        break;
                    case 4:
                        this.gameBlueController4 = value;
                        break;
                    default:
                        break;
                }
                break;
            case RED_TEAM_ID:
                switch (gameController) {
                    case 0:
                        this.gameRedController0 = value;
                        break;
                    case 1:
                        this.gameRedController1 = value;
                        break;
                    case 2:
                        this.gameRedController2 = value;
                        break;
                    case 3:
                        this.gameRedController3 = value;
                        break;
                    case 4:
                        this.gameRedController4 = value;
                        break;
                    default:
                }
                break;
            default:
        }
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

        const thisGame = await new Game({ gameSection, gameInstructor }).init();

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
        if (gameTeam === 0) {
            this.gameBluePoints = newPoints;
        } else {
            this.gameRedPoints = newPoints;
        }
    }

    /**
     * Set the status for a specific team in this game.
     */
    async setStatus(gameTeam: number, newStatus: number) {
        const queryString = 'UPDATE games set ?? = ? WHERE gameId = ?';
        const inserts = [`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Status`, newStatus, this.gameId];
        await pool.query(queryString, inserts);
        if (gameTeam === BLUE_TEAM_ID) {
            this.gameBlueStatus = newStatus;
        } else {
            this.gameRedStatus = newStatus;
        }
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

    /**
     * Change flag ownership for a certain team.
     */
    setFlag(flagNumber: number, flagValue: GameType['flag0']) {
        switch (flagNumber) {
            case 0:
                this.flag0 = flagValue;
                break;
            case 1:
                this.flag1 = flagValue;
                break;
            case 2:
                this.flag2 = flagValue;
                break;
            case 3:
                this.flag3 = flagValue;
                break;
            case 4:
                this.flag4 = flagValue;
                break;
            case 5:
                this.flag5 = flagValue;
                break;
            case 6:
                this.flag6 = flagValue;
                break;
            case 7:
                this.flag7 = flagValue;
                break;
            case 8:
                this.flag8 = flagValue;
                break;
            case 9:
                this.flag9 = flagValue;
                break;
            case 10:
                this.flag10 = flagValue;
                break;
            case 11:
                this.flag11 = flagValue;
                break;
            case 12:
                this.flag12 = flagValue;
                break;
            default:
        }
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
     * Dynamically get status for specific team.
     */
    getStatus(gameTeam: number) {
        if (gameTeam === BLUE_TEAM_ID) {
            return this.gameBlueStatus;
        }
        return this.gameRedStatus;
    }

    /**
     * Dynamically get points for specific team.
     */
    getPoints(gameTeam: number) {
        if (gameTeam === BLUE_TEAM_ID) {
            return this.gameBluePoints;
        }
        return this.gameRedPoints;
    }

    /**
     * Dynamically get passwordhash for specific team.
     */
    getPasswordHash(gameTeam: number) {
        if (gameTeam === BLUE_TEAM_ID) {
            return this.gameBluePassword;
        }
        return this.gameRedPassword;
    }

    /**
     * Generates a Redux Action, contains all current game information / state.
     */
    async initialStateAction(gameTeam: number, gameControllers: any) {
        const serverAction: GameInitialStateAction = {
            type: INITIAL_GAMESTATE,
            payload: {
                gameboardPieces: await Piece.getVisiblePieces(this.gameId, gameTeam),
                invItems: await InvItem.all(this.gameId, gameTeam),
                shopItems: await ShopItem.all(this.gameId, gameTeam),
                planning: {
                    confirmedPlans: await Plan.getConfirmedPlans(this.gameId, gameTeam)
                },
                capabilities: {
                    confirmedRods: await Capability.getRodsFromGod(this.gameId, gameTeam),
                    confirmedRemoteSense: await Capability.getRemoteSensing(this.gameId, gameTeam),
                    confirmedInsurgency: await Capability.getInsurgency(this.gameId, gameTeam),
                    confirmedBioWeapons: await Capability.getBiologicalWeapons(this.gameId, gameTeam),
                    confirmedRaiseMorale: await Capability.getRaiseMorale(this.gameId, gameTeam),
                    confirmedCommInterrupt: await Capability.getCommInterrupt(this.gameId, gameTeam),
                    confirmedGoldenEye: await Capability.getGoldenEye(this.gameId, gameTeam)
                },
                gameInfo: {
                    gameSection: this.gameSection,
                    gameInstructor: this.gameInstructor,
                    gameTeam,
                    gameControllers,
                    gamePhase: this.gamePhase,
                    gameRound: this.gameRound,
                    gameSlice: this.gameSlice,
                    gameStatus: this.getStatus(gameTeam),
                    gamePoints: this.getPoints(gameTeam),
                    flag0: this.flag0,
                    flag1: this.flag1,
                    flag2: this.flag2,
                    flag3: this.flag3,
                    flag4: this.flag4,
                    flag5: this.flag5,
                    flag6: this.flag6,
                    flag7: this.flag7,
                    flag8: this.flag8,
                    flag9: this.flag9,
                    flag10: this.flag10,
                    flag11: this.flag11,
                    flag12: this.flag12
                }
            }
        };

        if (this.gamePhase === NEWS_PHASE_ID) {
            const queryString = 'SELECT * FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1';
            const inserts = [this.gameId];
            const [resultNews] = await pool.query<RowDataPacket[] & NewsType[]>(queryString, inserts);

            serverAction.payload.news = {
                newsTitle: resultNews[0] !== undefined ? resultNews[0].newsTitle : 'No More News',
                newsInfo: resultNews[0] !== undefined ? resultNews[0].newsInfo : 'Click to continue'
            };
        }

        // TODO: get these values from the database (potentially throw this into the event object)
        // TODO: current event could be a refuel (or something else...need to handle all of them, and set other states as false...)
        // TODO: don't have to check if not in the combat phase...(prevent these checks for added efficiency?)
        const currentEvent = await Event.getNext(this.gameId, gameTeam);

        if (currentEvent) {
            const { eventTypeId } = currentEvent;
            switch (eventTypeId) {
                case POS_BATTLE_EVENT_TYPE:
                case COL_BATTLE_EVENT_TYPE:
                    const friendlyPiecesList: any = await currentEvent.getTeamItems(gameTeam === BLUE_TEAM_ID ? BLUE_TEAM_ID : RED_TEAM_ID);
                    const enemyPiecesList: any = await currentEvent.getTeamItems(gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID);
                    const friendlyPieces: { piece: PieceType; targetPiece: PieceType; targetPieceIndex?: number }[] = [];
                    const enemyPieces: {
                        targetPiece: any | null;
                        targetPieceIndex: number;
                        piece: any;
                    }[] = [];

                    // formatting for the frontend
                    for (let x = 0; x < friendlyPiecesList.length; x++) {
                        // need to transform pieces and stuff...
                        const thisFriendlyPiece: BattleState['friendlyPieces'][0] = {
                            // TODO: is this type annotation correct for 'index of this array type'?
                            piece: {
                                pieceId: friendlyPiecesList[x].pieceId,
                                pieceGameId: friendlyPiecesList[x].pieceGameId,
                                pieceTeamId: friendlyPiecesList[x].pieceTeamId,
                                pieceTypeId: friendlyPiecesList[x].pieceTypeId,
                                piecePositionId: friendlyPiecesList[x].piecePositionId,
                                pieceVisible: friendlyPiecesList[x].pieceVisible,
                                pieceMoves: friendlyPiecesList[x].pieceMoves,
                                pieceFuel: friendlyPiecesList[x].pieceFuel,
                                pieceContainerId: -1, // TODO: don't force these values to fit type, actually get them and put them here
                                pieceLanded: -1
                            },
                            targetPiece:
                                friendlyPiecesList[x].tpieceId == null
                                    ? null
                                    : {
                                          pieceId: friendlyPiecesList[x].tpieceId,
                                          pieceGameId: friendlyPiecesList[x].tpieceGameId,
                                          pieceTeamId: friendlyPiecesList[x].tpieceTeamId,
                                          pieceTypeId: friendlyPiecesList[x].tpieceTypeId,
                                          piecePositionId: friendlyPiecesList[x].tpiecePositionId,
                                          pieceVisible: friendlyPiecesList[x].tpieceVisible,
                                          pieceMoves: friendlyPiecesList[x].tpieceMoves,
                                          pieceFuel: friendlyPiecesList[x].tpieceFuel,
                                          pieceContainerId: -1, // TODO: don't force these (same as above)
                                          pieceLanded: -1
                                      }
                        };
                        friendlyPieces.push(thisFriendlyPiece);
                    }
                    for (let y = 0; y < enemyPiecesList.length; y++) {
                        enemyPieces.push({
                            targetPiece: null,
                            targetPieceIndex: -1,
                            piece: enemyPiecesList[y]
                        });
                    }

                    // now need to get the targetPieceIndex from the thing....if needed....
                    for (let z = 0; z < friendlyPieces.length; z++) {
                        if (friendlyPieces[z].targetPiece != null) {
                            const { pieceId } = friendlyPieces[z].targetPiece;

                            friendlyPieces[z].targetPieceIndex = enemyPieces.findIndex(enemyPieceThing => enemyPieceThing.piece.pieceId === pieceId);
                        }
                    }

                    serverAction.payload.battle = {
                        friendlyPieces,
                        enemyPieces
                    };
                    break;
                case REFUEL_EVENT_TYPE:
                    // need to get tankers and aircraft and put that into the payload...
                    const tankers: RefuelState['tankers'] = [];
                    const aircraft: RefuelState['aircraft'] = [];
                    const allRefuelItems = await currentEvent.getRefuelItems();

                    for (let x = 0; x < allRefuelItems.length; x++) {
                        const thisRefuelItem = allRefuelItems[x];
                        const { pieceTypeId } = thisRefuelItem;
                        if (pieceTypeId === AIR_REFUELING_SQUADRON_ID) {
                            tankers.push(thisRefuelItem);
                        } else {
                            aircraft.push(thisRefuelItem);
                        }
                    }

                    serverAction.payload.refuel = {
                        tankers,
                        aircraft
                    };
                    break;
                default:
                // do nothing, unknown event type...should do something...
            }
        }

        return serverAction;
    }
}

type GameConstructorOptionsWithId = {
    gameId: number;
};

type GameConstructorOptionsWithoutId = {
    gameSection: string;
    gameInstructor: string;
};

type GameOptions = GameConstructorOptionsWithId | GameConstructorOptionsWithoutId;
