import { Socket } from 'socket.io';
// prettier-ignore
import { ACCESS_TAG, ALREADY_IN_TAG, BAD_REQUEST_TAG, BAD_SESSION, DATABASE_TAG, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, LOGIN_TAG, NOT_LOGGED_IN_TAG, SET_USERFEEDBACK, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../constants';
import { GameSession, UserfeedbackAction } from '../types';

export type ALL_ERROR_TYPES =
    | typeof LOGIN_TAG
    | typeof ACCESS_TAG
    | typeof BAD_REQUEST_TAG
    | typeof GAME_INACTIVE_TAG
    | typeof ALREADY_IN_TAG
    | typeof NOT_LOGGED_IN_TAG
    | typeof DATABASE_TAG
    | typeof BAD_SESSION
    | typeof GAME_DOES_NOT_EXIST;

export const redirectClient = (socket: Socket, errorType: ALL_ERROR_TYPES) => {
    socket.emit(SOCKET_SERVER_REDIRECT, errorType);
};

export const sendToClient = (socket: Socket, action: { type: string; [extraProps: string]: any }) => {
    socket.emit(SOCKET_SERVER_SENDING_ACTION, action);
};

export const sendToGame = (socket: Socket, action: { type: string; [extraProps: string]: any }) => {
    const { gameId } = socket.handshake.session.ir3 as GameSession;
    socket.to(`game${gameId}`).emit(SOCKET_SERVER_SENDING_ACTION, action);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, action);
};

export const sendToTeam = (socket: Socket, team: number, action: { type: string; [extraProps: string]: any }) => {
    const { gameId, gameTeam } = socket.handshake.session.ir3 as GameSession;
    socket.to(`game${gameId}team${team}`).emit(SOCKET_SERVER_SENDING_ACTION, action);
    if (gameTeam === team) {
        socket.emit(SOCKET_SERVER_SENDING_ACTION, action);
    }
};

export const sendToThisTeam = (socket: Socket, action: { type: string; [extraProps: string]: any }) => {
    const { gameId, gameTeam } = socket.handshake.session.ir3 as GameSession;
    socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, action);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, action);
};

export const sendUserFeedback = async (socket: Socket, userFeedback: string) => {
    const serverAction: UserfeedbackAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };

    sendToClient(socket, serverAction);
};
