import { Dispatch } from 'redux';
import { emit, FullState } from '../..';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_SEA, WAITING_STATUS } from '../../../../../constants';
import { MissileSelectingAction, MISSILE_SELECTING, PieceType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to use missile in a silo to target a sea piece nearby.
 */
export const missileAttack = (piece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for missile attack dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use missile attack.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already clicked to continue'));
            return;
        }

        if (!gameControllers.includes(TYPE_SEA)) {
            dispatch(setUserfeedbackAction('must be sea controller to use'));
            return;
        }

        // TODO: could check that attack doesn't already exist for this piece (stored in capabilities)

        // TODO: should highlight the range of missile (max value in the ranges constant)

        // TODO: need a way to de-select this capability (currently can only refresh to exit)

        //dispatch that the player is currently selecting which position to select
        const missileSelecingAction: MissileSelectingAction = {
            type: MISSILE_SELECTING,
            payload: {
                selectedPiece: piece
            }
        };

        dispatch(missileSelecingAction);
        return;
    };
};
