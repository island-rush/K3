import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { BATTLE_PIECE_SELECT, WAITING_STATUS } from '../../../../../constants';
import { BattlePieceSelectAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const battlePieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
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
