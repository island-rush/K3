import { WAITING_STATUS } from "../../../constants/gameConstants";
import { DispatchType, EmitType } from "../../../constants/interfaces";
import { TARGET_PIECE_SELECT } from "../actionTypes";

const targetPieceClick = (battlePiece: any, battlePieceIndex: number) => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        //check the local state before sending to the server

        const { gameInfo } = getState();
        const { gameStatus } = gameInfo;
        if (gameStatus === WAITING_STATUS) {
            return;
        }

        dispatch({
            type: TARGET_PIECE_SELECT,
            payload: {
                battlePiece,
                battlePieceIndex
            }
        });
    };
};

export default targetPieceClick;
