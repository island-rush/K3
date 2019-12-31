import { Dispatch } from 'redux';
import { SERVER_CONFIRM_PLAN, SOCKET_CLIENT_SENDING_ACTION } from '../../../../../constants';
import { ConfirmPlanRequestAction, EmitType, FullState } from '../../../../../types';
import setUserfeedbackAction from '../setUserfeedbackAction';

/**
 * Action to confirm a list of moves as a plan for a piece.
 */
export const confirmPlan = () => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
        const { gameboardMeta, planning }: { gameboardMeta: any; planning: any } = getState();

        if (planning.moves.length === 0) {
            dispatch(setUserfeedbackAction("Can't submit an empty plan..."));
        } else {
            const clientAction: ConfirmPlanRequestAction = {
                type: SERVER_CONFIRM_PLAN,
                payload: {
                    pieceId: gameboardMeta.selectedPiece.pieceId,
                    plan: planning.moves
                }
            };

            emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
        }
    };
};

export default confirmPlan;
