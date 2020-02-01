import { BLUE_TEAM_ID, LOGGED_IN_VALUE } from '../../../constants';
import { GameType } from '../../../types';

export class GameProperties {
    readonly gameId: GameType['gameId'];
    readonly gameSection: string;
    readonly gameInstructor: string;
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
    airfield0: number;
    airfield1: number;
    airfield2: number;
    airfield3: number;
    airfield4: number;
    airfield5: number;
    airfield6: number;
    airfield7: number;
    airfield8: number;
    airfield9: number;

    // This necessary to access this object using this['string'] for dynamic values -> ex: this[`flag${flagNum}`]
    [key: string]: any;

    constructor(gameId: GameType['gameId']) {
        this.gameId = gameId;
    }

    getStatus(gameTeam: number) {
        return this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Status`];
    }

    getPoints(gameTeam: number) {
        return this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Points`];
    }

    getPasswordHash(gameTeam: number) {
        return this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Password`];
    }

    getLoggedIn(gameTeam: number, gameController: number): boolean {
        return this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Controller${gameController}`] === LOGGED_IN_VALUE;
    }
}
