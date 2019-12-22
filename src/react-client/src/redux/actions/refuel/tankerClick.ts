import { Dispatch } from 'redux';
import { EmitType, PieceType } from '../../../constants/interfaces';
import { TANKER_CLICK } from '../actionTypes';

/**
 * Action to select tanker to give fuel to other pieces.
 */
const tankerClick = (tankerPiece: PieceType, tankerPieceIndex: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //TODO: check for bad state (wrong phase? ...use userFeedback...)

        dispatch({
            type: TANKER_CLICK,
            payload: {
                tankerPiece,
                tankerPieceIndex
            }
        });
        return;
    };
};

export default tankerClick;
