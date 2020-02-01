import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { SERVER_CONFIRM_PLAN } from '../../../../../constants';
import { ConfirmPlanRequestAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to confirm a list of moves as a plan for a piece.
 */
export const confirmPlan = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameboardMeta, planning } = getState();

        if (planning.moves.length === 0 || !gameboardMeta.selectedPiece) {
            dispatch(setUserfeedbackAction("Can't submit an empty plan...or unselected piece."));
            return;
        }

        const clientAction: ConfirmPlanRequestAction = {
            type: SERVER_CONFIRM_PLAN,
            payload: {
                // TODO: send the piece, not just the id (even though only using the id on the server side anyway)
                pieceId: gameboardMeta.selectedPiece.pieceId,
                plan: planning.moves
            }
        };

        sendToServer(clientAction);
        return;
    };
};
