import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { GameboardPiecesDataType } from '../board';
import { PieceType } from '../databaseTables';
import { CapabilitiesState, GameInfoState, NewsState } from '../reducerTypes';

export const MAIN_BUTTON_CLICK = 'MAIN_BUTTON_CLICK';
export type MainButtonClickAction = {
    type: typeof MAIN_BUTTON_CLICK;
};

export const SERVER_MAIN_BUTTON_CLICK = 'SERVER_MAIN_BUTTON_CLICK';
export type MainButtonClickRequestAction = {
    type: typeof SERVER_MAIN_BUTTON_CLICK;
};

export const NEWS_PHASE = 'NEWS_PHASE';
export type NewsPhaseAction = {
    type: typeof NEWS_PHASE;
    payload: {
        news: NewsState;
        gamePoints: GameInfoState['gamePoints'];
    };
};

export const NEWSPOPUP_MINIMIZE_TOGGLE = 'NEWSPOPUP_MINIMIZE_TOGGLE';
export type NewsPopupToggleAction = {
    type: typeof NEWSPOPUP_MINIMIZE_TOGGLE;
    payload: {};
};

export const PURCHASE_PHASE = 'PURCHASE_PHASE';
export type PurchasePhaseAction = {
    type: typeof PURCHASE_PHASE;
};

export const COMBAT_PHASE = 'COMBAT_PHASE';
export type CombatPhaseAction = {
    type: typeof COMBAT_PHASE;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
    };
};

export const NEW_ROUND = 'NEW_ROUND';
export type NewRoundAction = {
    type: typeof NEW_ROUND;
    payload: {
        gameRound: GameInfoState['gameRound'];
        gameboardPieces: GameboardPiecesDataType;
        confirmedRemoteSense: CapabilitiesState['confirmedRemoteSense'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
        confirmedSeaMines: CapabilitiesState['confirmedSeaMines'];
        confirmedDroneSwarms: CapabilitiesState['confirmedDroneSwarms'];
        confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
        confirmedNukes: CapabilitiesState['confirmedNukes'];
        confirmedAntiSat: CapabilitiesState['confirmedAntiSat'];
        confirmedMissileDisrupts: CapabilitiesState['confirmedMissileDisrupts'];
        cyberDefenseIsActive: CapabilitiesState['isCyberDefenseActive'];
    };
};

export const SLICE_CHANGE = 'SLICE_CHANGE';
export type SliceChangeAction = {
    type: typeof SLICE_CHANGE;
    payload: {
        confirmedRods: CapabilitiesState['confirmedRods'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
        confirmedMissileDisrupts: CapabilitiesState['confirmedMissileDisrupts'];
        confirmedNukes: CapabilitiesState['confirmedNukes'];
        confirmedMissileHitPos: CapabilitiesState['confirmedMissileHitPos'];
        confirmedBombardmentHitPos: CapabilitiesState['confirmedBombardmentHitPos'];
        confirmedInsurgencyPos: LIST_ALL_POSITIONS_TYPE[];
        confirmedInsurgencyPieces: PieceType[];
        gameboardPieces: GameboardPiecesDataType;
    };
};

export const PLACE_PHASE = 'PLACE_PHASE';
export type PlacePhaseAction = {
    type: typeof PLACE_PHASE;
    payload: {
        gameboardPieces: GameboardPiecesDataType;
        confirmedRemoteSense: CapabilitiesState['confirmedRemoteSense'];
        confirmedBioWeapons: CapabilitiesState['confirmedBioWeapons'];
        confirmedRaiseMorale: CapabilitiesState['confirmedRaiseMorale'];
        confirmedCommInterrupt: CapabilitiesState['confirmedCommInterrupt'];
        confirmedGoldenEye: CapabilitiesState['confirmedGoldenEye'];
        confirmedSeaMines: CapabilitiesState['confirmedSeaMines'];
        confirmedDroneSwarms: CapabilitiesState['confirmedDroneSwarms'];
        confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
        confirmedNukes: CapabilitiesState['confirmedNukes'];
        confirmedAntiSat: CapabilitiesState['confirmedAntiSat'];
        confirmedMissileDisrupts: CapabilitiesState['confirmedMissileDisrupts'];
        cyberDefenseIsActive: CapabilitiesState['isCyberDefenseActive'];
    };
};
