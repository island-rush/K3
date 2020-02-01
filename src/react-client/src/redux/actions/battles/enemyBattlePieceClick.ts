import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { ENEMY_PIECE_SELECT, WAITING_STATUS } from '../../../../../constants';
import { EnemyPieceSelectAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const enemyBattlePieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo, battle } = getState();
        const { gameStatus } = gameInfo;

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction("can't do more, already submitted (status == 1)"));
            return;
        }

        const { selectedBattlePiece, selectedBattlePieceIndex } = battle;

        if (selectedBattlePiece === -1 || selectedBattlePieceIndex === -1) {
            dispatch(setUserfeedbackAction('Must select piece to attack with..'));
            return;
        }

        const enemyPieceSelectAction: EnemyPieceSelectAction = {
            type: ENEMY_PIECE_SELECT,
            payload: {
                battlePiece,
                battlePieceIndex
            }
        };

        dispatch(enemyPieceSelectAction);
        return;
    };
};
