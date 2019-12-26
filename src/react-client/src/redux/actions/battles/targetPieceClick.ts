import { Dispatch } from 'redux';
import { WAITING_STATUS } from '../../../../../constants';
import { EmitType, TargetPieceClickAction } from '../../../interfaces/interfaces';
import { TARGET_PIECE_SELECT } from '../actionTypes';

export const targetPieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //check the local state before sending to the server

        const { gameInfo } = getState();
        const { gameStatus } = gameInfo;
        if (gameStatus === WAITING_STATUS) {
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
    };
};

export default targetPieceClick;
