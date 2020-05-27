export const TYPHOON_AREA = [120, 285, 286, 287, 304, 305, 306, 307, 315, 316, 308, 326, 242, 361, 370, 373, 374, 375, 378, 388, 391, 392, 395, 405, 408, 409, 410, 411, 473, 474, 475, 490, 493, 506, 510, 524, 527, 528, 530, 540, 547, 558, 565, 575, 580, 593, 597, 608, 609, 610, 614, 627, 628, 629, 631, 645, 646, 647, 663, 680, 697, 713];
// 120, 315 and 316 added to typhoonArea for testing purposes
export const TYPHOON_ROUNDS = 3;

export enum NEWS_EFFECT_TYPE {
    DisablePieces,
    BlockPositions,
    DisableAndBlock,
    DeletePieces,
    RemoveMoney
}

// export const TYPE_APOLLO = 1;
// export const TYPE_TYPHOON = 2;
// export const TYPE_TSUNAMI = 3;
// export const TYPE_APRIL = 4;
// export const TYPE_COKE = 5;
// export const TYPE_WATER = 6;
// export const TYPE_WRENCH = 7;
// export const TYPE_OUTBREAK = 8;
// export const TYPE_BREAKING = 9;
// export const TYPE_ERUPTION = 10;
// export const TYPE_FAILURE = 11;
// export const TYPE_SHAKEUP = 12;
// export const TYPE_COUP = 13;
// export const TYPE_HURRICAN = 14;
// export const TYPE_RECESSION = 15;
// export const TYPE_STEM = 16;
// export const TYPE_AMAZON = 17;
// export const TYPE_BITCOIN = 18;
// export const TYPE_STRIKE = 19;

export const TYPE_DISABLE_PIECES = 1; // Disable pieces NOT based on position
export const TYPE_FREEZE_POSITIONS = 2; // Disable pieces based on position
export const TYPE_HUMANITARIAN = 3;
// news effects with instant effects may not require asigning a type
// because they will not have rounds that need to be tracked
export const TYPE_DELETE_PIECES = 4;
export const TYPE_REMOVE_POINTS = 5;
export const TYPE_OTHER = 6;

export const NEWS_EFFECTS: { [id: number]: string } = {};
// NEWS_EFFECTS[TYPE_APOLLO] = 'APOLLO';
// NEWS_EFFECTS[TYPE_TYPHOON] = 'TYPHOON';
// NEWS_EFFECTS[TYPE_TSUNAMI] = 'TSUNAMI';
// NEWS_EFFECTS[TYPE_APRIL] = 'APRIL';
// NEWS_EFFECTS[TYPE_COKE] = 'COKE';
// NEWS_EFFECTS[TYPE_WATER] = 'WATER';
// NEWS_EFFECTS[TYPE_WRENCH] = 'WRENCH';
// NEWS_EFFECTS[TYPE_OUTBREAK] = 'OUTBREAK';
// NEWS_EFFECTS[TYPE_BREAKING] = 'BREAKING';
// NEWS_EFFECTS[TYPE_ERUPTION] = 'ERUPTION';
// NEWS_EFFECTS[TYPE_FAILURE] = 'FAILURE';
// NEWS_EFFECTS[TYPE_SHAKEUP] = 'SHAKEUP';
// NEWS_EFFECTS[TYPE_COUP] = 'COUP';
// NEWS_EFFECTS[TYPE_HURRICAN] = 'HURRICAN';
// NEWS_EFFECTS[TYPE_RECESSION] = 'RECESSION';
// NEWS_EFFECTS[TYPE_STEM] = 'STEM';
// NEWS_EFFECTS[TYPE_AMAZON] = 'AMAZON';
// NEWS_EFFECTS[TYPE_BITCOIN] = 'BITCOIN';
// NEWS_EFFECTS[TYPE_STRIKE] = 'STRIKE';
NEWS_EFFECTS[TYPE_DISABLE_PIECES] = 'DISABLE PIECES';
NEWS_EFFECTS[TYPE_FREEZE_POSITIONS] = 'FREEZE POSITIONS';
NEWS_EFFECTS[TYPE_HUMANITARIAN] = 'HUMANITARIAN';
NEWS_EFFECTS[TYPE_DELETE_PIECES] = 'DELETE';
NEWS_EFFECTS[TYPE_REMOVE_POINTS] = 'REMOVE POINTS';
NEWS_EFFECTS[TYPE_OTHER] = 'OTHER';
