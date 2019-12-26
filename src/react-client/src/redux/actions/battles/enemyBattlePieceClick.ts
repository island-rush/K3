import { Dispatch } from 'redux';
import { WAITING_STATUS } from '../../../../../constants';
import { EmitType, EnemyPieceSelectAction } from '../../../interfaces/interfaces';
import { ENEMY_PIECE_SELECT } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';

export const enemyBattlePieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameboardMeta, gameInfo } = getState();
        const { gameStatus } = gameInfo;

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction("can't do more, already submitted (status == 1)"));
            return;
        }

        const { selectedBattlePiece, selectedBattlePieceIndex } = gameboardMeta.battle;

        if (selectedBattlePiece === -1 || selectedBattlePieceIndex === -1) {
            dispatch(setUserfeedbackAction('Must select piece to attack with..'));
        } else {
            const enemyPieceSelectAction: EnemyPieceSelectAction = {
                type: ENEMY_PIECE_SELECT,
                payload: {
                    battlePiece,
                    battlePieceIndex
                }
            };

            dispatch(enemyPieceSelectAction);
        }
    };
};

export default enemyBattlePieceClick;
