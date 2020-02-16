import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, TYPE_AIR, WAITING_STATUS } from '../../../../../constants';
import { PieceType, TankerClickAction, TANKER_CLICK } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to select tanker to give fuel to other pieces.
 */
export const tankerClick = (tankerPiece: PieceType, tankerPieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();

        const { gameControllers, gameStatus, gamePhase } = gameInfo;

        if (!gameControllers.includes(TYPE_AIR)) {
            dispatch(setUserfeedbackAction('must be air commander to do refueling'));
            return;
        }

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('must be combat phase to open air refuel.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already confirmed waiting for other team.'));
            return;
        }

        const tankerClickAction: TankerClickAction = {
            type: TANKER_CLICK,
            payload: {
                tankerPiece,
                tankerPieceIndex
            }
        };

        dispatch(tankerClickAction);
        return;
    };
};
