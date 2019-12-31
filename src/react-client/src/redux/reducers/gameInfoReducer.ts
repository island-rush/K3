import { AnyAction } from 'redux';
// prettier-ignore
import { COMBAT_PHASE, COMBAT_PHASE_ID, EVENT_BATTLE, INITIAL_GAMESTATE, MAIN_BUTTON_CLICK, NEWS_PHASE, NEWS_PHASE_ID, NEW_ROUND, NOT_WAITING_STATUS, NO_MORE_EVENTS, PLACE_PHASE, PLACE_PHASE_ID, PURCHASE_PHASE, PURCHASE_PHASE_ID, SHOP_PURCHASE, SHOP_REFUND, SLICE_CHANGE, SLICE_EXECUTING_ID, SLICE_PLANNING_ID, UPDATE_FLAGS, WAITING_STATUS } from '../../../../constants';
// prettier-ignore
import { EventBattleAction, GameInfoState, GameInitialStateAction, NewRoundAction, NewsPhaseAction, NoMoreEventsAction, ShopPurchaseAction, ShopRefundAction, UpdateFlagAction } from '../../../../types';

const initialGameInfoState: GameInfoState = {
    gameSection: 'Loading...',
    gameInstructor: 'Loading...',
    gameTeam: -1,
    gameControllers: [],
    gamePhase: -1,
    gameRound: -1,
    gameSlice: -1,
    gameStatus: -1,
    gamePoints: -1,
    flag0: -1,
    flag1: -1,
    flag2: -1,
    flag3: -1,
    flag4: -1,
    flag5: -1,
    flag6: -1,
    flag7: -1,
    flag8: -1,
    flag9: -1,
    flag10: -1,
    flag11: -1,
    flag12: -1
};

export function gameInfoReducer(state = initialGameInfoState, action: AnyAction) {
    const { type } = action;

    let stateCopy: GameInfoState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case INITIAL_GAMESTATE:
            return (action as GameInitialStateAction).payload.gameInfo;

        case SHOP_PURCHASE:
            stateCopy.gamePoints = (action as ShopPurchaseAction).payload.points;
            return stateCopy;

        case NO_MORE_EVENTS:
            stateCopy.gameStatus = (action as NoMoreEventsAction).payload.gameStatus;
            return stateCopy;

        case SHOP_REFUND:
            stateCopy.gamePoints += (action as ShopRefundAction).payload.pointsAdded;
            return stateCopy;

        case PURCHASE_PHASE:
            stateCopy.gamePhase = PURCHASE_PHASE_ID;
            stateCopy.gameStatus = NOT_WAITING_STATUS;
            return stateCopy;

        case UPDATE_FLAGS:
            Object.assign(stateCopy, (action as UpdateFlagAction).payload);
            return stateCopy;

        case MAIN_BUTTON_CLICK:
            stateCopy.gameStatus = WAITING_STATUS;
            return stateCopy;

        case COMBAT_PHASE:
            stateCopy.gameStatus = NOT_WAITING_STATUS;
            stateCopy.gamePhase = COMBAT_PHASE_ID;
            return stateCopy;

        case SLICE_CHANGE:
            stateCopy.gameStatus = NOT_WAITING_STATUS;
            stateCopy.gameSlice = SLICE_EXECUTING_ID;
            return stateCopy;

        case PLACE_PHASE:
            stateCopy.gamePhase = PLACE_PHASE_ID;
            stateCopy.gameStatus = NOT_WAITING_STATUS;
            return stateCopy;

        case EVENT_BATTLE:
            if ((action as EventBattleAction).payload.gameStatus !== null) {
                stateCopy.gameStatus = (action as EventBattleAction).payload.gameStatus;
            }
            return stateCopy;

        case NEW_ROUND:
            stateCopy.gameRound = (action as NewRoundAction).payload.gameRound;
            stateCopy.gameStatus = NOT_WAITING_STATUS;
            stateCopy.gameSlice = SLICE_PLANNING_ID;
            return stateCopy;

        case NEWS_PHASE:
            stateCopy.gamePhase = NEWS_PHASE_ID;
            stateCopy.gameStatus = NOT_WAITING_STATUS;
            stateCopy.gameRound = 0;
            stateCopy.gameSlice = SLICE_PLANNING_ID;
            stateCopy.gamePoints = (action as NewsPhaseAction).payload.gamePoints;
            return stateCopy;

        default:
            return state;
    }
}

export default gameInfoReducer;
