import { BLUE_TEAM_ID, LOGGED_IN_VALUE } from '../../../constants';
import { BlueOrRedTeamId, ControllerType, GameType } from '../../../types';

export class GameProperties {
    readonly gameId: GameType['gameId'];
    readonly gameSection: GameType['gameSection'];
    readonly gameInstructor: GameType['gameInstructor'];
    gameAdminPassword: GameType['gameAdminPassword'];
    gameActive: GameType['gameActive'];
    gameBluePassword: GameType['gameBluePassword'];
    gameRedPassword: GameType['gameRedPassword'];
    gameBlueController0: GameType['gameBlueController0'];
    gameBlueController1: GameType['gameBlueController1'];
    gameBlueController2: GameType['gameBlueController2'];
    gameBlueController3: GameType['gameBlueController3'];
    gameBlueController4: GameType['gameBlueController4'];
    gameRedController0: GameType['gameRedController0'];
    gameRedController1: GameType['gameRedController1'];
    gameRedController2: GameType['gameRedController2'];
    gameRedController3: GameType['gameRedController3'];
    gameRedController4: GameType['gameRedController4'];
    gameBlueStatus: GameType['gameBlueStatus'];
    gameRedStatus: GameType['gameRedStatus'];
    gameBluePoints: GameType['gameBluePoints'];
    gameRedPoints: GameType['gameRedPoints'];
    gamePhase: GameType['gamePhase'];
    gameRound: GameType['gameRound'];
    gameSlice: GameType['gameSlice'];
    flag0: GameType['flag0'];
    flag1: GameType['flag1'];
    flag2: GameType['flag2'];
    flag3: GameType['flag3'];
    flag4: GameType['flag4'];
    flag5: GameType['flag5'];
    flag6: GameType['flag6'];
    flag7: GameType['flag7'];
    flag8: GameType['flag8'];
    flag9: GameType['flag9'];
    flag10: GameType['flag10'];
    flag11: GameType['flag11'];
    flag12: GameType['flag12'];
    airfield0: GameType['airfield0'];
    airfield1: GameType['airfield1'];
    airfield2: GameType['airfield2'];
    airfield3: GameType['airfield3'];
    airfield4: GameType['airfield4'];
    airfield5: GameType['airfield5'];
    airfield6: GameType['airfield6'];
    airfield7: GameType['airfield7'];
    airfield8: GameType['airfield8'];
    airfield9: GameType['airfield9'];

    // This necessary to access this object using this['string'] for dynamic values -> ex: this[`flag${flagNum}`]
    [key: string]: any;

    constructor(gameId: GameType['gameId']) {
        this.gameId = gameId;
    }

    getStatus(gameTeam: BlueOrRedTeamId) {
        return this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Status`];
    }

    getPoints(gameTeam: BlueOrRedTeamId) {
        return this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Points`];
    }

    getPasswordHash(gameTeam: BlueOrRedTeamId) {
        return this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Password`];
    }

    getLoggedIn(gameTeam: BlueOrRedTeamId, gameController: ControllerType): boolean {
        return this[`game${gameTeam === BLUE_TEAM_ID ? 'Blue' : 'Red'}Controller${gameController}`] === LOGGED_IN_VALUE;
    }

    getAirfield(airfieldNum: number) {
        return this[`airfield${airfieldNum}`];
    }
}
