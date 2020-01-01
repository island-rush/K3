import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';
import { emit, init } from './websocket';

export const setupStore = () => {
    const initialState = {};

    const middleware = [thunk.withExtraArgument(emit)];

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
