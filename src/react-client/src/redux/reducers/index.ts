import { combineReducers } from "redux";
import userFeedback from "./userFeedback";
import gameInfoReducer from "./gameInfoReducer";
import shopReducer from "./shopReducer";
import invReducer from "./invReducer";
import gameboardReducer from "./gameboardReducer";
import gameboardMetaReducer from "./gameboardMetaReducer";

const rootReducer = combineReducers({
    userFeedback,
    gameInfo: gameInfoReducer,
    shopItems: shopReducer,
    invItems: invReducer,
    gameboard: gameboardReducer,
    gameboardMeta: gameboardMetaReducer
});

export default rootReducer;
