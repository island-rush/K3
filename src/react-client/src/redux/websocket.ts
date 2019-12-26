import { AnyAction, Store } from 'redux';
import io from 'socket.io-client';
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../../../constants';
import { EmitType } from '../interfaces/interfaces';

const socket: SocketIOClient.Socket = io(window.location.hostname);

/**
 * Web Sockets connected to the store are listening for Redux Actions and Redirects.
 */
export const init = (store: Store) => {
    socket.on(SOCKET_SERVER_SENDING_ACTION, (reduxAction: AnyAction) => {
        store.dispatch(reduxAction);
    });

    socket.on(SOCKET_SERVER_REDIRECT, (serverError: string) => {
        window.location.replace(`//${window.location.hostname}/index.html?error=${serverError}`);
    });
};

/**
 * Middleware to allow client to send requests to server through web socket.
 */
export const emit: EmitType = (requestType: string, action: AnyAction) => socket.emit(requestType, action); //TODO: refactor the emit (client-side), since we always know this is SOCKET_CLIENT_SENDING_ACTION
