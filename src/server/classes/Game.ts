import { FieldPacket } from "mysql2";
//prettier-ignore
import { ALL_FLAG_LOCATIONS, DRAGON_ISLAND_ID, EAGLE_ISLAND_ID, FULLER_ISLAND_ID, HR_REPUBLIC_ISLAND_ID, ISLAND_POINTS, KEONI_ISLAND_ID, LION_ISLAND_ID, MONTAVILLE_ISLAND_ID, NOYARC_ISLAND_ID, RICO_ISLAND_ID, SHOR_ISLAND_ID, TAMU_ISLAND_ID } from "../../react-client/src/constants/gameboardConstants";
import { AIR_REFUELING_SQUADRON_ID, BLUE_TEAM_ID, CAPTURE_TYPES, NEWS_PHASE_ID, RED_TEAM_ID } from "../../react-client/src/constants/gameConstants";
import { INITIAL_GAMESTATE } from "../../react-client/src/redux/actions/actiontypes";
import { COL_BATTLE_EVENT_TYPE, POS_BATTLE_EVENT_TYPE, REFUEL_EVENT_TYPE } from "../actions/eventConstants";
import { gameInitialNews, gameInitialPieces } from "../admin";
import { Capability, Event, InvItem, Piece, Plan, ShopItem } from "../classes";
import pool from "../database";

interface GameConstructorOptionsWithId {
    gameId: number;
}

interface GameConstructorOptionsWithoutId {
    gameSection: string;
    gameInstructor: string;
}

type GameOptions = GameConstructorOptionsWithId | GameConstructorOptionsWithoutId;

interface Game {
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
}

class Game {
    constructor(options: GameOptions) {
        if ((options as GameConstructorOptionsWithId).gameId) {
            this.gameId = (options as GameConstructorOptionsWithId).gameId;
        } else {
            this.gameSection = (options as GameConstructorOptionsWithoutId).gameSection;
            this.gameInstructor = (options as GameConstructorOptionsWithoutId).gameInstructor;
        }
    }

    async init() {
        let queryString: string;
        let inserts: any[];

        if (this.gameId) {
            queryString = "SELECT * FROM games WHERE gameId = ?";
            inserts = [this.gameId];
        } else if (this.gameSection && this.gameInstructor) {
            queryString = "SELECT * FROM games WHERE gameSection = ? AND gameInstructor = ?";
            inserts = [this.gameSection, this.gameInstructor];
        }

        const [rows, fields]: [any[], FieldPacket[]] = await pool.query(queryString, inserts);

        if (rows.length != 1) {
            return null;
        } else {
            Object.assign(this, rows[0]);
            return this;
        }
    }

    getLoggedIn(gameTeam: number, gameController: number) {
        if (gameTeam == 0) {
            if (gameController === 0) {
                return this.game0Controller0;
            } else if (gameController === 1) {
                return this.game0Controller1;
            } else if (gameController === 2) {
                return this.game0Controller2;
            } else if (gameController === 3) {
                return this.game0Controller3;
            } else {
                return this.game0Controller4;
            }
        } else {
            if (gameController === 0) {
                return this.game1Controller0;
            } else if (gameController === 1) {
                return this.game1Controller1;
            } else if (gameController === 2) {
                return this.game1Controller2;
            } else if (gameController === 3) {
                return this.game1Controller3;
            } else {
                return this.game1Controller4;
            }
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
        switch (gameTeam) {
            case BLUE_TEAM_ID:
                switch (gameController) {
                    case 0:
                        this.game0Controller0 = value;
                    case 1:
                        this.game0Controller1 = value;
                    case 2:
                        this.game0Controller2 = value;
                    case 3:
                        this.game0Controller3 = value;
                    case 4:
                        this.game0Controller4 = value;
                }
            case RED_TEAM_ID:
                switch (gameController) {
                    case 0:
                        this.game1Controller0 = value;
                    case 1:
                        this.game1Controller1 = value;
                    case 2:
                        this.game1Controller2 = value;
                    case 3:
                        this.game1Controller3 = value;
                    case 4:
                        this.game1Controller4 = value;
                }
        }
    }

    async reset() {
        await this.delete();
        await Game.add(this.gameSection, this.gameInstructor, this.gameAdminPassword, { gameId: this.gameId });
    }

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

        const [result, fields] = await pool.query(queryString, inserts);

        if (result.affectedRows == 0) return;

        const thisGame = await new Game({ gameSection, gameInstructor }).init();

        await gameInitialPieces(thisGame.gameId);
        await gameInitialNews(thisGame.gameId);

        return thisGame;
    }

    async setPoints(gameTeam: number, newPoints: number) {
        const queryString = "UPDATE games SET ?? = ? WHERE gameId = ?";
        const inserts = ["game" + gameTeam + "Points", newPoints, this.gameId];
        await pool.query(queryString, inserts);
        if (gameTeam == 0) {
            this.game0Points = newPoints;
        } else {
            this.game1Points = newPoints;
        }
    }

    async setStatus(gameTeam: number, newStatus: number) {
        const queryString = "UPDATE games set ?? = ? WHERE gameId = ?";
        const inserts = ["game" + gameTeam + "Status", newStatus, this.gameId];
        await pool.query(queryString, inserts);
        if (gameTeam == 0) {
            this.game0Status = newStatus;
        } else {
            this.game1Status = newStatus;
        }
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

    async updateFlags() {
        let didUpdateFlags = false;
        //only certain pieces can capture
        //see if any pieces are currently residing on flags by themselves, and if so, set the island# in the database and update 'this' object correspondingly
        let queryString = "SELECT * FROM pieces WHERE pieceGameId = ? AND piecePositionId in (?) AND pieceTypeId in (?)";
        let inserts = [this.gameId, ALL_FLAG_LOCATIONS, CAPTURE_TYPES];
        let [results, fields] = await pool.query(queryString, inserts);

        if (results.length === 0) {
            return;
        }

        //need to set all positions that have pieces on them (that are different from current values?)
        //update if only 1 team's pieces there, AND if not already the other team? (or update anyway if all 1 team)

        //TODO: need major refactoring here, this is quick and dirty (but should work)
        let eachFlagsTeams: any = [[], [], [], [], [], [], [], [], [], [], [], [], []];
        for (let x = 0; x < results.length; x++) {
            let thisPiece = results[x];
            let { piecePositionId, pieceTeamId } = thisPiece;
            let flagNum = ALL_FLAG_LOCATIONS.indexOf(piecePositionId);
            eachFlagsTeams[flagNum].push(pieceTeamId);
        }

        for (let y = 0; y < eachFlagsTeams.length; y++) {
            let thisFlagsTeams = eachFlagsTeams[y];
            if (thisFlagsTeams.length === 0) continue;
            if (thisFlagsTeams.includes(BLUE_TEAM_ID) && thisFlagsTeams.includes(RED_TEAM_ID)) continue;
            //else update this thing
            this.setFlag(y, thisFlagsTeams[0]);
            //sql update
            queryString = "UPDATE games SET ?? = ? WHERE gameId = ?";
            inserts = ["flag" + y, thisFlagsTeams[0], this.gameId];
            await pool.query(queryString, inserts);
            didUpdateFlags = true;
        }

        return didUpdateFlags;
    }

    setFlag(flagNumber: number, flagValue: number) {
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

    async getNextNews() {
        //Delete the old news
        let queryString = "DELETE FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1";
        let inserts = [this.gameId];
        await pool.query(queryString, inserts);

        //Grab the next news
        queryString = "SELECT newsTitle, newsInfo FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1";
        const [resultNews, fields] = await pool.query(queryString, inserts);
        const { newsTitle, newsInfo } =
            resultNews[0] !== undefined
                ? resultNews[0]
                : { newsTitle: "No More News", newsInfo: "Obviously you've been playing this game too long..." };

        return {
            active: true,
            newsTitle,
            newsInfo
        };
    }

    async addPoints() {
        //add points based on the island ownerships inside this object (game)
        let bluePoints = this.game0Points;
        let redPoints = this.game1Points;

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

    getStatus(gameTeam: number) {
        if (gameTeam == 0) {
            return this.game0Status;
        } else {
            return this.game1Status;
        }
    }

    getPoints(gameTeam: number) {
        if (gameTeam == 0) {
            return this.game0Points;
        } else {
            return this.game1Points;
        }
    }

    getPasswordHash(gameTeam: number) {
        if (gameTeam == 0) {
            return this.game0Password;
        } else {
            return this.game1Password;
        }
    }

    async initialStateAction(gameTeam: number, gameControllers: any) {
        let serverAction: any = {
            type: INITIAL_GAMESTATE,
            payload: {}
        };

        serverAction.payload.invItems = await InvItem.all(this.gameId, gameTeam);
        serverAction.payload.shopItems = await ShopItem.all(this.gameId, gameTeam);
        serverAction.payload.gameboardPieces = await Piece.getVisiblePieces(this.gameId, gameTeam);

        serverAction.payload.gameInfo = {
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
        };

        serverAction.payload.gameboardMeta = {};
        serverAction.payload.gameboardMeta.confirmedPlans = await Plan.getConfirmedPlans(this.gameId, gameTeam);
        serverAction.payload.gameboardMeta.confirmedRods = await Capability.getRodsFromGod(this.gameId, gameTeam);
        serverAction.payload.gameboardMeta.confirmedRemoteSense = await Capability.getRemoteSensing(this.gameId, gameTeam);
        serverAction.payload.gameboardMeta.confirmedInsurgency = await Capability.getInsurgency(this.gameId, gameTeam);
        serverAction.payload.gameboardMeta.confirmedBioWeapons = await Capability.getBiologicalWeapons(this.gameId, gameTeam);
        serverAction.payload.gameboardMeta.confirmedRaiseMorale = await Capability.getRaiseMorale(this.gameId, gameTeam);
        serverAction.payload.gameboardMeta.confirmedCommInterrupt = await Capability.getCommInterrupt(this.gameId, gameTeam);
        serverAction.payload.gameboardMeta.confirmedGoldenEye = await Capability.getGoldenEye(this.gameId, gameTeam);

        //Could put news into its own object, but don't really use it much...(TODO: figure out if need to refactor this...)
        if (this.gamePhase == NEWS_PHASE_ID) {
            let queryString = "SELECT newsTitle, newsInfo FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1";
            let inserts = [this.gameId];
            const [resultNews, fields] = await pool.query(queryString, inserts);
            const { newsTitle, newsInfo } =
                resultNews[0] !== undefined
                    ? resultNews[0]
                    : { newsTitle: "No More News", newsInfo: "Obviously you've been playing this game too long..." };

            serverAction.payload.gameboardMeta.news = {
                active: true,
                newsTitle,
                newsInfo
            };
        }

        //TODO: get these values from the database (potentially throw this into the event object)
        //TODO: current event could be a refuel (or something else...need to handle all of them, and set other states as false...)
        //TODO: don't have to check if not in the combat phase...(prevent these checks for added efficiency?)
        const currentEvent = await Event.getNext(this.gameId, gameTeam);

        if (currentEvent) {
            const { eventTypeId } = currentEvent;
            switch (eventTypeId) {
                case POS_BATTLE_EVENT_TYPE:
                case COL_BATTLE_EVENT_TYPE:
                    let friendlyPiecesList: any = await currentEvent.getTeamItems(gameTeam == BLUE_TEAM_ID ? BLUE_TEAM_ID : RED_TEAM_ID);
                    let enemyPiecesList: any = await currentEvent.getTeamItems(gameTeam == BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID);
                    let friendlyPieces: any = [];
                    let enemyPieces = [];

                    //formatting for the frontend
                    for (let x = 0; x < friendlyPiecesList.length; x++) {
                        //need to transform pieces and stuff...
                        let thisFriendlyPiece = {
                            piece: {
                                pieceId: friendlyPiecesList[x].pieceId,
                                pieceGameId: friendlyPiecesList[x].pieceGameId,
                                pieceTeamId: friendlyPiecesList[x].pieceTeamId,
                                pieceTypeId: friendlyPiecesList[x].pieceTypeId,
                                piecePositionId: friendlyPiecesList[x].piecePositionId,
                                pieceVisible: friendlyPiecesList[x].pieceVisible,
                                pieceMoves: friendlyPiecesList[x].pieceMoves,
                                pieceFuel: friendlyPiecesList[x].pieceFuel
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
                                          pieceFuel: friendlyPiecesList[x].tpieceFuel
                                      }
                        };
                        friendlyPieces.push(thisFriendlyPiece);
                    }
                    for (let y = 0; y < enemyPiecesList.length; y++) {
                        let thisEnemyPiece: any = {
                            targetPiece: null,
                            targetPieceIndex: -1
                        };
                        thisEnemyPiece.piece = enemyPiecesList[y];
                        enemyPieces.push(thisEnemyPiece);
                    }

                    //now need to get the targetPieceIndex from the thing....if needed....
                    for (let z = 0; z < friendlyPieces.length; z++) {
                        if (friendlyPieces[z].targetPiece != null) {
                            const { pieceId } = friendlyPieces[z].targetPiece;

                            friendlyPieces[z].targetPieceIndex = enemyPieces.findIndex(enemyPieceThing => enemyPieceThing.piece.pieceId == pieceId);
                        }
                    }

                    serverAction.payload.gameboardMeta.battle = {
                        active: true,
                        friendlyPieces,
                        enemyPieces
                    };
                    break;
                case REFUEL_EVENT_TYPE:
                    //need to get tankers and aircraft and put that into the payload...
                    let tankers = [];
                    let aircraft = [];
                    const allRefuelItems: any = await currentEvent.getRefuelItems();

                    for (let x = 0; x < allRefuelItems.length; x++) {
                        let thisRefuelItem = allRefuelItems[x];
                        let { pieceTypeId } = thisRefuelItem;
                        if (pieceTypeId === AIR_REFUELING_SQUADRON_ID) {
                            tankers.push(thisRefuelItem);
                        } else {
                            aircraft.push(thisRefuelItem);
                        }
                    }

                    serverAction.payload.gameboardMeta.refuel = {
                        active: true,
                        tankers,
                        aircraft,
                        selectedTankerPieceId: -1,
                        selectedTankerPieceIndex: -1
                    };
                    break;
                default:
                //do nothing, unknown event type...should do something...
            }
        }

        return serverAction;
    }
}

export default Game;
