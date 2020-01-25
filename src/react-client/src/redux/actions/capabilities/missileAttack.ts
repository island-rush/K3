import { Dispatch } from 'redux';
import { emit, FullState } from '../..';
import { COMBAT_PHASE_ID, MISSILE_SELECTING, SLICE_PLANNING_ID } from '../../../../../constants';
import { MissileSelectingAction, PieceType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to use missile in a silo to target a sea piece nearby.
 */
export const missileAttack = (piece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for missile attack dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use missile attack.'));
            return;
        }

        // TODO: could check that attack doesn't already exist for this piece (stored in capabilities)

        //dispatch that the player is currently selecting which position to select
        const missileSelecingAction: MissileSelectingAction = {
            type: MISSILE_SELECTING,
            payload: {
                selectedPiece: piece
            }
        };

        dispatch(missileSelecingAction);
    };
};
