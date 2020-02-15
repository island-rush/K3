import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { CANCEL_PLAN, DeletePlanRequestAction, PreventPlanAction, SERVER_DELETE_PLAN } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

// TODO: rename cancelPlan to deletePlan to match the server side function (possibly match all client/server functions with each other...)
/**
 * Action to cancel a plan for a piece.
 */
export const cancelPlan = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameboardMeta, planning } = getState();

        if (planning.isActive) {
            const preventPlanAction: PreventPlanAction = {
                type: CANCEL_PLAN,
                payload: {}
            };

            dispatch(preventPlanAction);
            return;
        }

        //check to see if there is a piece selected and if that piece has a confirmed plan
        if (gameboardMeta.selectedPiece !== null && gameboardMeta.selectedPiece.pieceId in planning.confirmedPlans) {
            //delete the plans from the database request
            const clientAction: DeletePlanRequestAction = {
                type: SERVER_DELETE_PLAN,
                payload: {
                    pieceId: gameboardMeta.selectedPiece.pieceId
                }
            };

            sendToServer(clientAction);
            return;
        }

        dispatch(setUserfeedbackAction('Must select a piece to delete + already have a plan for it to cancel/delete'));
        return;
    };
};
