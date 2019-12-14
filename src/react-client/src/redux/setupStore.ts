import { createStore, applyMiddleware, compose, Store } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import rootReducer from "./reducers";
import { init, emit } from "./websocket";

const setupStore = () => {
    const initialState = {};

    const middleware: ThunkMiddleware[] = [thunk.withExtraArgument(emit)];

    const store: Store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middleware),
            ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) || compose
        )
    );

    init(store);

    return store;
};

export default setupStore;
