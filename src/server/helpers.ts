import { Socket } from 'socket.io';
// prettier-ignore
import { ACCESS_TAG, ALREADY_IN_TAG, BAD_REQUEST_TAG, BAD_SESSION, DATABASE_TAG, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, LOGIN_TAG, NOT_LOGGED_IN_TAG, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../constants';
import { io } from '../server';
import { BlueOrRedTeamId, GameType, SET_USERFEEDBACK, UserfeedbackAction } from '../types';

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

export const redirectClient = (socketId: Socket['id'], errorType: ALL_ERROR_TYPES) => {
    io.to(`${socketId}`).emit(SOCKET_SERVER_REDIRECT, errorType);
};

export const sendToClient = (socketId: Socket['id'], action: { type: string; [extraProps: string]: any }) => {
    io.to(`${socketId}`).emit(SOCKET_SERVER_SENDING_ACTION, action);
};

export const sendToTeam = (gameId: GameType['gameId'], team: BlueOrRedTeamId, action: { type: string; [extraProps: string]: any }) => {
    io.in(`game${gameId}team${team}`).emit(SOCKET_SERVER_SENDING_ACTION, action);
};

export const sendToGame = (gameId: GameType['gameId'], action: { type: string; [extraProps: string]: any }) => {
    io.in(`game${gameId}`).emit(SOCKET_SERVER_SENDING_ACTION, action);
};

export const userFeedbackAction = (userFeedback: string) => {
    const userFeedbackAction: UserfeedbackAction = {
        type: SET_USERFEEDBACK,
        payload: {
            userFeedback
        }
    };

    return userFeedbackAction;
};

export const sendUserFeedback = async (socketId: Socket['id'], userFeedback: string) => {
    sendToClient(socketId, userFeedbackAction(userFeedback));
};
