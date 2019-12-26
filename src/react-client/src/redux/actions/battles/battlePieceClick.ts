import { Dispatch } from 'redux';
import { WAITING_STATUS } from '../../../../../constants';
import { BattlePieceSelectAction, EmitType } from '../../../interfaces/interfaces';
import { BATTLE_PIECE_SELECT } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';

export const battlePieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameInfo } = getState();
        const { gameStatus } = gameInfo;
        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction("can't make more selections, status == 1, already submitted probably"));
            return;
        }

        const battlePieceSelectAction: BattlePieceSelectAction = {
            type: BATTLE_PIECE_SELECT,
            payload: {
                battlePiece,
                battlePieceIndex
            }
        };

        dispatch(battlePieceSelectAction);
    };
};

export default battlePieceClick;
