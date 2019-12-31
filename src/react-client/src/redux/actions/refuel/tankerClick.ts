import { Dispatch } from 'redux';
import { TANKER_CLICK } from '../../../../../constants';
import { EmitType, FullState, PieceType, TankerClickAction } from '../../../../../types';

/**
 * Action to select tanker to give fuel to other pieces.
 */
export const tankerClick = (tankerPiece: PieceType, tankerPieceIndex: number) => {
    return (dispatch: Dispatch, getState: () => FullState, emit: EmitType) => {
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
