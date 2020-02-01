import { Socket } from 'socket.io';
import { GameType } from './databaseTables';

export type SocketSession = Socket['handshake']['session'] & {
    ir3: GameSession;
    socketId: Socket['id'];
};

/**
 * This object stored within session.ir3 to tie users to game, team, and controller(s)
 */
export type GameSession = {
    gameId: GameType['gameId'];
    gameTeam: number;
    gameControllers: number[];
};

/**
 * This object stored within session.ir3teacher to tie user to game as teacher.
 */
export type TeacherSession = {
    gameId: GameType['gameId'];
    gameSection: string;
    gameInstructor: string;
};
