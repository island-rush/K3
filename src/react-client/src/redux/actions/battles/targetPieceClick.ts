import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { TARGET_PIECE_SELECT, WAITING_STATUS } from '../../../../../constants';
import { TargetPieceClickAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const targetPieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        //check the local state before sending to the server

        const { gameInfo, battle } = getState();
        const { gameStatus } = gameInfo;
        if (gameStatus === WAITING_STATUS) {
            // TODO: should we give userfeedback here? (probably, best to let them know why it's not working...)
            dispatch(setUserfeedbackAction('already submitted?, gameStatus = waiting on other team'));
            return;
        }

        if (battle.masterRecord) {
            dispatch(setUserfeedbackAction('click return to battle first'));
            return;
        }

        const targetPieceSelectAction: TargetPieceClickAction = {
            type: TARGET_PIECE_SELECT,
            payload: {
                battlePiece,
                battlePieceIndex
            }
        };

        dispatch(targetPieceSelectAction);
        return;
    };
};
