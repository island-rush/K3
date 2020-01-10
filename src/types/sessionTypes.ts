import { Socket } from 'socket.io';

export type SocketSession = Socket['handshake']['session'] & {
    ir3: GameSession;
    socketId: Socket['id'];
};

/**
 * This object stored within session.ir3 to tie users to game, team, and controller(s)
 */
export type GameSession = {
    gameId: number;
    gameTeam: number;
    gameControllers: number[];
};

/**
 * This object stored within session.ir3teacher to tie user to game as teacher.
 */
export type TeacherSession = {
    gameId: number;
    gameSection: string;
    gameInstructor: string;
};
