import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_OWNERS } from '../../../../../constants';
import { StartPlanAction, START_PLAN } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

// TODO: need more checks on all the frontend planning functions (gamePhase/gameSlice...)
/**
 * Action to set gamestate in a planning state to click positions for a plan for a piece.
 */
export const startPlan = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameboardMeta, gameInfo, planning } = getState();

        if (planning.bombardmentSelecting !== null || planning.missileSelecting !== null || planning.isUsingCapability) {
            dispatch(setUserfeedbackAction("Button doesn't apply to capability"));
            return;
        }

        if (gameboardMeta.selectedPiece == null) {
            dispatch(setUserfeedbackAction('Must select a piece to plan a move...'));
            return;
        }

        const { selectedPiece } = gameboardMeta;
        const { gamePhase, gameControllers, gameTeam, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('Not the right phase for planning...'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('Already Executing, wait for next planning slice.'));
            return;
        }

        let atLeast1Owner = false;
        for (let x = 0; x < gameControllers.length; x++) {
            let gameController = gameControllers[x];
            if (TYPE_OWNERS[gameController].includes(selectedPiece.pieceTypeId)) {
                atLeast1Owner = true;
                break;
            }
        }

        if (!atLeast1Owner || selectedPiece.pieceTeamId !== gameTeam) {
            dispatch(setUserfeedbackAction("Piece doesn't fall under your control"));
            return;
        }

        console.log(selectedPiece);
        if (0 < selectedPiece.isPieceDisabled) {
            dispatch(setUserfeedbackAction('Piece is disabled'));
            return;
        }

        if (planning.isActive) {
            dispatch(setUserfeedbackAction('Already planning a move...'));
            return;
        }

        if (planning.confirmedPlans[selectedPiece.pieceId]) {
            dispatch(setUserfeedbackAction('Already has a plan, click the x button to get rid of the old plan first...'));
            return;
        }

        const startPlanAction: StartPlanAction = {
            type: START_PLAN,
            payload: {}
        };

        dispatch(startPlanAction);
        return;
    };
};
