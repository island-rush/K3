import { INNER_TRANSPORT_PIECE_CLICK_ACTION } from "../actionTypes";

const innerTransportPieceClick = (selectedPiece: any, containerPiece: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        //TODO: figure out if inner piece click is allowed
        //TODO: could probably see if there is even land next to where this piece is (don't allow if in the open ocean?)

        dispatch({
            type: INNER_TRANSPORT_PIECE_CLICK_ACTION,
            payload: {
                selectedPiece,
                containerPiece
            }
        });
    };
};

export default innerTransportPieceClick;
