import { PieceType } from '../databaseTables';
// prettier-ignore
import { BattleState, CapabilitiesState, GameboardMetaState, GameInfoState, InvState, NewsState, PlanningState, RefuelState, ShopState, UserfeedbackState } from '../reducerTypes';

export type GameboardPiecesDataType = { [positionIndex: number]: PieceType[] };

export const INITIAL_GAMESTATE = 'INITIAL_GAMESTATE';
export type GameInitialStateAction = {
    type: typeof INITIAL_GAMESTATE;
    payload: {
        invItems: InvState;
        shopItems: ShopState;
        gameboardPieces: GameboardPiecesDataType;
        gameInfo: GameInfoState;
        capabilities: CapabilitiesState;
        planning: {
            confirmedPlans: PlanningState['confirmedPlans'];
        };
        news?: {
            newsTitle: NewsState['newsTitle'];
            newsInfo: NewsState['newsInfo'];
        };
        battle?: {
            friendlyPieces: BattleState['friendlyPieces'];
            enemyPieces: BattleState['enemyPieces'];
        };
        refuel?: {
            tankers: RefuelState['tankers'];
            aircraft: RefuelState['aircraft'];
        };
    };
};

export const SET_USERFEEDBACK = 'SET_USERFEEDBACK';
export type UserfeedbackAction = {
    type: typeof SET_USERFEEDBACK;
    payload: {
        userFeedback: UserfeedbackState;
    };
};

export const MENU_SELECT = 'MENU_SELECT';
export type MenuSelectAction = {
    type: typeof MENU_SELECT;
    payload: {
        selectedMenuId: GameboardMetaState['selectedMenuId'];
    };
};

export const PIECE_CLICK = 'PIECE_CLICK';
export type PieceClickAction = {
    type: typeof PIECE_CLICK;
    payload: {
        selectedPiece: PieceType;
    };
};

export const PIECE_CLEAR_SELECTION = 'PIECE_CLEAR_SELECTION';
export type PieceClearAction = {
    type: typeof PIECE_CLEAR_SELECTION;
    payload: {};
};

export const MAIN_BUTTON_CLICK = 'MAIN_BUTTON_CLICK';
export type MainButtonClickAction = {
    type: typeof MAIN_BUTTON_CLICK;
};

export const SERVER_MAIN_BUTTON_CLICK = 'SERVER_MAIN_BUTTON_CLICK';
export type MainButtonClickRequestAction = {
    type: typeof SERVER_MAIN_BUTTON_CLICK;
};

export const POSITION_SELECT = 'POSITION_SELECT';
export type PositionSelectAction = {
    type: typeof POSITION_SELECT;
    payload: {
        selectedPositionId: GameboardMetaState['selectedPosition'];
    };
};

export const HIGHLIGHT_POSITIONS = 'HIGHLIGHT_POSITIONS';
export type HighlightPositionsAction = {
    type: typeof HIGHLIGHT_POSITIONS;
    payload: {
        highlightedPositions: GameboardMetaState['highlightedPositions'];
    };
};

export const UPDATE_FLAGS = 'UPDATE_FLAGS';
export type UpdateFlagAction = {
    type: typeof UPDATE_FLAGS;
    payload: {
        flag0: GameInfoState['flag0'];
        flag1: GameInfoState['flag1'];
        flag2: GameInfoState['flag2'];
        flag3: GameInfoState['flag3'];
        flag4: GameInfoState['flag4'];
        flag5: GameInfoState['flag5'];
        flag6: GameInfoState['flag6'];
        flag7: GameInfoState['flag7'];
        flag8: GameInfoState['flag8'];
        flag9: GameInfoState['flag9'];
        flag10: GameInfoState['flag10'];
        flag11: GameInfoState['flag11'];
        flag12: GameInfoState['flag12'];
    };
};

export const UPDATE_AIRFIELDS = 'UPDATE_AIRFIELDS';
export type UpdateAirfieldAction = {
    type: typeof UPDATE_AIRFIELDS;
    payload: {
        airfield0: GameInfoState['airfield0'];
        airfield1: GameInfoState['airfield1'];
        airfield2: GameInfoState['airfield2'];
        airfield3: GameInfoState['airfield3'];
        airfield4: GameInfoState['airfield4'];
        airfield5: GameInfoState['airfield5'];
        airfield6: GameInfoState['airfield6'];
        airfield7: GameInfoState['airfield7'];
        airfield8: GameInfoState['airfield8'];
        airfield9: GameInfoState['airfield9'];
    };
};
