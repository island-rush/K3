import { Dispatch } from 'redux';
import { EmitType, TankerClickAction } from '../../../interfaces/interfaces';
import { TANKER_CLICK } from '../actionTypes';
import { PieceType } from '../../../interfaces/classTypes';

/**
 * Action to select tanker to give fuel to other pieces.
 */
export const tankerClick = (tankerPiece: PieceType, tankerPieceIndex: number) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //TODO: check for bad state (wrong phase? ...use userFeedback...)

        const tankerClickAction: TankerClickAction = {
            type: TANKER_CLICK,
            payload: {
                tankerPiece,
                tankerPieceIndex
            }
        };

        dispatch(tankerClickAction);
        return;
    };
};

export default tankerClick;
