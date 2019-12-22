import { combineReducers } from 'redux';
import gameboardMetaReducer from './gameboardMetaReducer';
import gameboardReducer from './gameboardReducer';
import gameInfoReducer from './gameInfoReducer';
import invReducer from './invReducer';
import shopReducer from './shopReducer';
import userFeedback from './userFeedback';

const rootReducer = combineReducers({
    userFeedback,
    gameInfo: gameInfoReducer,
    shopItems: shopReducer,
    invItems: invReducer,
    gameboard: gameboardReducer,
    gameboardMeta: gameboardMetaReducer
});

export default rootReducer;
