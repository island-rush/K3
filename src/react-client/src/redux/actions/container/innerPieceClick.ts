import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_OWNERS, WAITING_STATUS } from '../../../../../constants';
import { ExitContainerRequestAction, PieceType, SERVER_INNER_PIECE_CLICK } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Move piece from inside container to outside (same position)
 */
export const innerPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameControllers, gameStatus } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID && gameSlice !== SLICE_PLANNING_ID) {
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

        // TODO: right position? (need to have exception for airdrop vs airfield checks)

        const clientAction: ExitContainerRequestAction = {
            type: SERVER_INNER_PIECE_CLICK,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        sendToServer(clientAction);
        return;
    };
};
