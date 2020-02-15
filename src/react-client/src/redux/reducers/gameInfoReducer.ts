import { AnyAction } from 'redux';
// prettier-ignore
import { COMBAT_PHASE_ID, NEUTRAL_TEAM_ID, NEWS_PHASE_ID, NOT_WAITING_STATUS, PLACE_PHASE_ID, PURCHASE_PHASE_ID, SLICE_EXECUTING_ID, SLICE_PLANNING_ID, WAITING_STATUS } from '../../../../constants';
// prettier-ignore
import { BATTLE_FIGHT_RESULTS, BATTLE_SELECTIONS, COMBAT_PHASE, EventBattleAction, EVENT_BATTLE, GameInfoState, GameInitialStateAction, INITIAL_GAMESTATE, MAIN_BUTTON_CLICK, NewRoundAction, NewsPhaseAction, NEWS_PHASE, NEW_ROUND, NoMoreBattlesAction, NO_MORE_BATTLES, PLACE_PHASE, PURCHASE_PHASE, ShopPurchaseAction, ShopRefundAction, SHOP_PURCHASE, SHOP_REFUND, SLICE_CHANGE, UpdateAirfieldAction, UpdateFlagAction, UPDATE_AIRFIELDS, UPDATE_FLAGS } from '../../../../types';

const initialGameInfoState: GameInfoState = {
    gameSection: 'Loading...',
    gameInstructor: 'Loading...',
    gameTeam: NEUTRAL_TEAM_ID,
    gameControllers: [],
    gamePhase: 0,
    gameRound: -1,
    gameSlice: 0,
    gameStatus: 0,
    gamePoints: -1,
    flag0: NEUTRAL_TEAM_ID,
    flag1: NEUTRAL_TEAM_ID,
    flag2: NEUTRAL_TEAM_ID,
    flag3: NEUTRAL_TEAM_ID,
    flag4: NEUTRAL_TEAM_ID,
    flag5: NEUTRAL_TEAM_ID,
    flag6: NEUTRAL_TEAM_ID,
    flag7: NEUTRAL_TEAM_ID,
    flag8: NEUTRAL_TEAM_ID,
    flag9: NEUTRAL_TEAM_ID,
    flag10: NEUTRAL_TEAM_ID,
    flag11: NEUTRAL_TEAM_ID,
    flag12: NEUTRAL_TEAM_ID,
    airfield0: NEUTRAL_TEAM_ID,
    airfield1: NEUTRAL_TEAM_ID,
    airfield2: NEUTRAL_TEAM_ID,
    airfield3: NEUTRAL_TEAM_ID,
    airfield4: NEUTRAL_TEAM_ID,
    airfield5: NEUTRAL_TEAM_ID,
    airfield6: NEUTRAL_TEAM_ID,
    airfield7: NEUTRAL_TEAM_ID,
    airfield8: NEUTRAL_TEAM_ID,
    airfield9: NEUTRAL_TEAM_ID
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

        case NO_MORE_BATTLES:
            stateCopy.gameStatus = (action as NoMoreBattlesAction).payload.gameStatus;
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

        case UPDATE_AIRFIELDS:
            Object.assign(stateCopy, (action as UpdateAirfieldAction).payload);
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

        case BATTLE_FIGHT_RESULTS:
            stateCopy.gameStatus = NOT_WAITING_STATUS; // TODO: best practice might be to always let server tell us the status (keep logic over there, don't assume? (don't want to get out of sync if server is ever different))
            return stateCopy;

        case BATTLE_SELECTIONS:
            stateCopy.gameStatus = WAITING_STATUS;
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
            // Do Nothing
            return state;
    }
}
