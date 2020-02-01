import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { TARGET_PIECE_SELECT, WAITING_STATUS } from '../../../../../constants';
import { TargetPieceClickAction } from '../../../../../types';

export const targetPieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
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
        return;
    };
};
