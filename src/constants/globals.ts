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
