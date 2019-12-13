import io from "socket.io-client";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../constants/otherConstants";
import { Store } from "redux";

const socket = io(window.location.hostname);

export const init = (store: Store) => {
    socket.on(SOCKET_SERVER_SENDING_ACTION, ({ type, payload }: { type: string; payload: any }) => {
        store.dispatch({ type, payload });
    });

    socket.on(SOCKET_SERVER_REDIRECT, (serverError: string) => {
        window.location.replace(`//${window.location.hostname}/index.html?error=${serverError}`);
    });
};

export const emit = (type: string, payload: any) => socket.emit(type, payload); //TODO: refactor the emit (client-side), since we always know this is SOCKET_CLIENT_SENDING_ACTION
