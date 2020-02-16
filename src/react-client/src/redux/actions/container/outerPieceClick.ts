import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { EnterContainerRequestAction, PieceType, SERVER_OUTER_PIECE_CLICK } from '../../../../../types';
import { COMBAT_PHASE_ID, WAITING_STATUS, TYPE_OWNERS, SLICE_PLANNING_ID } from '../../../../../constants';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to move outside piece to the inside of a container.
 */
export const outerPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID || gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('wrong phase to enter container'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('still waiting on other team, cant do more.'));
            return;
        }

        let atLeast1Owner = false;
        for (const gameController of gameControllers) {
            if (TYPE_OWNERS[gameController].includes(selectedPiece.pieceTypeId)) {
                atLeast1Owner = true;
                break;
            }
        }

        if (!atLeast1Owner) {
            dispatch(setUserfeedbackAction('you dont own that piece, cant enter container with it'));
            return;
        }

        const clientAction: EnterContainerRequestAction = {
            type: SERVER_OUTER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        sendToServer(clientAction);
        return;
    };
};
