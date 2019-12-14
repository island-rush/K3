import { TANKER_CLICK } from "../actionTypes";

const tankerClick = (tankerPiece: any, tankerPieceIndex: any) => {
    return (dispatch: any, getState: any, emit: any) => {
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
