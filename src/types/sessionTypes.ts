import { Socket } from 'socket.io';
import { TYPE_AIR, TYPE_LAND, TYPE_MAIN, TYPE_SEA, TYPE_SPECIAL } from '../constants';
import { BlueOrRedTeamId, GameType } from './databaseTables';

export type ControllerType = typeof TYPE_MAIN | typeof TYPE_AIR | typeof TYPE_LAND | typeof TYPE_SEA | typeof TYPE_SPECIAL;

export type SocketSession = Socket['handshake']['session'] & {
    ir3: GameSession;
    socketId: Socket['id'];
};

/**
 * This object stored within session.ir3 to tie users to game, team, and controller(s)
 */
export type GameSession = {
    gameId: GameType['gameId'];
    gameTeam: BlueOrRedTeamId; // TODO: potential errors if we assume neutral is part of gameTeam type, but almost always do checking based on blue and red team
    gameControllers: ControllerType[];
};

/**
 * This object stored within session.ir3teacher to tie user to game as teacher.
 */
export type TeacherSession = {
    gameId: GameType['gameId'];
    gameSection: string;
    gameInstructor: string;
};
