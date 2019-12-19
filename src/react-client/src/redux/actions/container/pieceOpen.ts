import { CONTAINER_TYPES } from "../../../constants/gameConstants";
import { DispatchType, EmitType, PieceType } from "../../../constants/interfaces";
import { PIECE_OPEN_ACTION } from "../actionTypes";
import setUserfeedbackAction from "../setUserfeedbackAction";

/**
 * Double Click a container piece to open it.
 */
const pieceOpen = (selectedPiece: PieceType) => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        const { gameboard } = getState();

        const { pieceTypeId } = selectedPiece;

        //TODO: only show pieces that could go inside this container (specify that to the reducer?)
        //TODO: do these checks on the backend as well
        //TODO: are there any situations when we would not want players to look inside containers? (not likely)

        //don't want to open pieces that aren't container types
        if (!CONTAINER_TYPES.includes(pieceTypeId)) {
            dispatch(setUserfeedbackAction("Not a piece that can hold other pieces..."));
            return;
        }

        dispatch({
            type: PIECE_OPEN_ACTION,
            payload: {
                selectedPiece,
                gameboard
            }
        });
    };
};

export default pieceOpen;
