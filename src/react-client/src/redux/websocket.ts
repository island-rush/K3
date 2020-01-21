import { AnyAction, Store } from 'redux';
import io from 'socket.io-client';
import { SOCKET_CLIENT_SENDING_ACTION, SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from '../../../constants';
import { ALL_ERROR_TYPES } from '../../../server/';

const socket: SocketIOClient.Socket = io(window.location.hostname, {
    transports: ['websocket', 'polling']
});

/**
 * Web Sockets connected to the store are listening for Redux Actions and Redirects.
 */
export const init = (store: Store) => {
    socket.on(SOCKET_SERVER_SENDING_ACTION, (reduxAction: AnyAction) => {
        store.dispatch(reduxAction);
    });

    socket.on(SOCKET_SERVER_REDIRECT, (serverError: ALL_ERROR_TYPES) => {
        window.location.replace(`//${window.location.hostname}/index.html?error=${serverError}`);
    });
};

/**
 * Middleware to allow client to send requests to server through web socket. Used as 'sendToServer' redux-thunk parameter
 */
export const emit = (action: AnyAction) => socket.emit(SOCKET_CLIENT_SENDING_ACTION, action);
