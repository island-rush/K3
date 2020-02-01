export const BLUE_TEAM_ID = 0;
export const RED_TEAM_ID = 1;
export const NEUTRAL_TEAM_ID = -1;

export const NOT_WAITING_STATUS = 0;
export const WAITING_STATUS = 1;

export const NOT_LOGGED_IN_VALUE = 0;
export const LOGGED_IN_VALUE = 1;

// These values used as first parameter (identifier) in socket.emit and socket.on
export const SOCKET_SERVER_REDIRECT = 'serverRedirect';
export const SOCKET_SERVER_SENDING_ACTION = 'serverSendingAction';
export const SOCKET_CLIENT_SENDING_ACTION = 'clientSendingAction';

export const ACTIVATED = 1;
export const DEACTIVATED = 0;

export const NEWS_PHASE_ID = 0;
export const PURCHASE_PHASE_ID = 1;
export const COMBAT_PHASE_ID = 2;
export const PLACE_PHASE_ID = 3;

export const SLICE_PLANNING_ID = 0;
export const SLICE_EXECUTING_ID = 1;

export const BOTH_TEAMS_INDICATOR = 2;
export const POS_BATTLE_EVENT_TYPE = 1;
export const COL_BATTLE_EVENT_TYPE = 0;
export const REFUEL_EVENT_TYPE = 2;

export const ROUNDS_PER_COMBAT_PHASE = 2; // 0 indexed

/**
 * COCOM
 */
export const TYPE_MAIN = 0;
/**
 * JFACC
 */
export const TYPE_AIR = 1;
/**
 * JFLCC
 */
export const TYPE_LAND = 2;
/**
 * JFMCC
 */
export const TYPE_SEA = 3;
/**
 * JFSOCC
 */
export const TYPE_SPECIAL = 4;

export const TYPE_OWNER_NAMES: { [id: number]: string } = {};
TYPE_OWNER_NAMES[TYPE_MAIN] = 'COCOM';
TYPE_OWNER_NAMES[TYPE_AIR] = 'JFACC';
TYPE_OWNER_NAMES[TYPE_LAND] = 'JFLCC';
TYPE_OWNER_NAMES[TYPE_SEA] = 'JFMCC';
TYPE_OWNER_NAMES[TYPE_SPECIAL] = 'JFSOCC';

export const ALL_COMMANDER_TYPES = [TYPE_MAIN, TYPE_AIR, TYPE_LAND, TYPE_SEA, TYPE_SPECIAL];

export const NO_MENU_INDEX = -1;
export const SHOP_MENU_INDEX = 0;
export const INV_MENU_INDEX = 1;
export const SPACE_MENU_INDEX = 2;
export const GAME_INFO_MENU_INDEX = 3;
