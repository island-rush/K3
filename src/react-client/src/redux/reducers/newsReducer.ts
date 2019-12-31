import { AnyAction } from 'redux';
import { NewsState } from '../../../../types';

const initialNewsState: NewsState = {
    isMinimized: false,
    active: false,
    newsTitle: 'Loading Title...',
    newsInfo: 'Loading Info...'
};

export function newsReducer(state = initialNewsState, action: AnyAction) {
    const { type } = action;

    let stateCopy: NewsState = JSON.parse(JSON.stringify(state));

    switch (type) {
        default:
            return state;
    }
}

export default newsReducer;
