// prettier-ignore
import { BioWeaponsAction, CommInterruptAction, GoldenEyeAction, InsurgencyAction, RaiseMoraleAction, RemoteSensingAction, RodsFromGodAction } from './capabilityActions';
// prettier-ignore
import { EventBattleAction, EventRefuelAction, GameInitialStateAction, NewRoundAction, NoMoreEventsAction, PlacePhaseAction, SliceChangeAction } from './interfaces';

export type CapabilityReducerActions =
    | GameInitialStateAction
    | NewRoundAction
    | PlacePhaseAction
    | RaiseMoraleAction
    | RodsFromGodAction
    | CommInterruptAction
    | InsurgencyAction
    | RemoteSensingAction
    | GoldenEyeAction
    | SliceChangeAction
    | EventBattleAction
    | NoMoreEventsAction
    | EventRefuelAction
    | BioWeaponsAction;
