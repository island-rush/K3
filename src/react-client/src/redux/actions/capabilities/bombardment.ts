import { Dispatch } from 'redux';
import { emit, FullState } from '../..';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from '../../../../../constants';
import { BombardmentSelectingAction, BOMBARDMENT_SELECTING, PieceType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to use bombardment to target a land piece nearby.
 */
export const bombardment = (piece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for bombardment attack dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use bombardment attack.'));
            return;
        }

        // TODO: could check that attack doesn't already exist for this piece (stored in capabilities)

        // TODO: should highlight the range of bombardment (max value in the ranges constant)

        // TODO: need a way to de-select this capability (currently can only refresh to exit)

        //dispatch that the player is currently selecting which position to select
        const bombardmentSelectingAction: BombardmentSelectingAction = {
            type: BOMBARDMENT_SELECTING,
            payload: {
                selectedPiece: piece
            }
        };

        dispatch(bombardmentSelectingAction);
        return;
    };
};
