import { combineReducers } from 'redux';
import { gameboardMetaReducer } from './gameboardMetaReducer';
import { gameboardReducer } from './gameboardReducer';
import { gameInfoReducer } from './gameInfoReducer';
import { invReducer } from './invReducer';
import { shopReducer } from './shopReducer';
import { userFeedbackReducer } from './userFeedback';
import { capabilitiesReducer } from './capabilitiesReducer';
import { planningReducer } from './planningReducer';
import { containerReducer } from './containerReducer';
import { refuelReducer } from './refuelReducer';
import { battleReducer } from './battleReducer';
import { newsReducer } from './newsReducer';

export const rootReducer = combineReducers({
    userFeedback: userFeedbackReducer,
    gameInfo: gameInfoReducer,
    shopItems: shopReducer,
    invItems: invReducer,
    gameboard: gameboardReducer,
    gameboardMeta: gameboardMetaReducer,
    capabilities: capabilitiesReducer,
    planning: planningReducer,
    container: containerReducer,
    refuel: refuelReducer,
    battle: battleReducer,
    news: newsReducer
});

export default rootReducer;
