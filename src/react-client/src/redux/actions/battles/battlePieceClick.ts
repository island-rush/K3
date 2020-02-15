import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { WAITING_STATUS } from '../../../../../constants';
import { BattlePieceSelectAction, BATTLE_PIECE_SELECT } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const battlePieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo, battle } = getState();
        const { gameStatus } = gameInfo;

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction("can't make more selections, status == 1, already submitted probably"));
            return;
        }

        if (battle.masterRecord) {
            dispatch(setUserfeedbackAction('click return to battle first'));
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
        return;
    };
};
