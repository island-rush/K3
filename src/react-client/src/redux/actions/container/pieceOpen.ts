import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { CONTAINER_TYPES, PIECE_OPEN_ACTION, PIECE_CLOSE_ACTION } from '../../../../../constants';
import { PieceOpenAction, PieceType, PieceCloseAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Double Click a container piece to open it.
 */
export const pieceOpen = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameboard, container } = getState();

        const { pieceTypeId } = selectedPiece;

        // TODO: only show pieces that could go inside this container (specify that to the reducer?)
        // TODO: do these checks on the backend as well
        // TODO: are there any situations when we would not want players to look inside containers? (not likely)

        //don't want to open pieces that aren't container types
        if (!CONTAINER_TYPES.includes(pieceTypeId)) {
            dispatch(setUserfeedbackAction('Not a piece that can hold other pieces...'));
            return;
        }

        // TODO: get rid of ! here
        // double click the same piece to close again (isActive should mean there is a containerPiece (not null))
        if (container.isActive && container.containerPiece!.pieceId === selectedPiece.pieceId) {
            const clientAction: PieceCloseAction = {
                type: PIECE_CLOSE_ACTION,
                payload: {
                    selectedPiece
                }
            };

            dispatch(clientAction);
            return;
        }

        const clientAction: PieceOpenAction = {
            type: PIECE_OPEN_ACTION,
            payload: {
                selectedPiece,
                gameboard
            }
        };

        dispatch(clientAction);
        return;
    };
};
