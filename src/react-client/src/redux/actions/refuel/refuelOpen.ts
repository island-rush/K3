import { Dispatch } from 'redux';
import { emit, FullState } from '../..';
import { PieceType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to use open refuel popup.
 */
export const refuelOpen = (piece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

        if (piece.pieceTeamId !== gameInfo.gameTeam) {
            dispatch(setUserfeedbackAction('piece does not belong to you'));
            return;
        }

        dispatch(setUserfeedbackAction('refuel open thing'));
        return;
    };
};
