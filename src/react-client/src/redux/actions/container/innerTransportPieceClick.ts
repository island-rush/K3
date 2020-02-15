import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
// prettier-ignore
import { COMBAT_PHASE_ID, distanceMatrix, initialGameboardEmpty, LAND_TYPE, SLICE_PLANNING_ID, TYPE_OWNERS, WAITING_STATUS } from '../../../../../constants';
import {
    ExitTransportContainerAction,
    INNER_TRANSPORT_PIECE_CLICK_ACTION,
    PieceType,
    HighlightPositionsAction,
    HIGHLIGHT_POSITIONS
} from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Move a piece from inside a transport to outside (adjacent land)
 */
export const innerTransportPieceClick = (selectedPiece: PieceType, containerPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        // TODO: are they allowed to enter land with enemy on it? (visible vs invisible?) (assumed yes since land invasion is a thing)

        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID && gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('wrong phase to enter container'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('still waiting on other team, cant do more.'));
            return;
        }

        let atLeast1Owner = false;
        for (const gameController of gameControllers) {
            if (TYPE_OWNERS[gameController].includes(selectedPiece.pieceTypeId)) {
                atLeast1Owner = true;
                break;
            }
        }

        if (!atLeast1Owner) {
            dispatch(setUserfeedbackAction('you dont own that piece, cant enter container with it'));
            return;
        }

        // is there land around to put the piece on....
        const posToPutOn = [];
        const { piecePositionId } = containerPiece;
        for (let x = 0; x < distanceMatrix[piecePositionId].length; x++) {
            if (distanceMatrix[piecePositionId][x] === 1) {
                const { type } = initialGameboardEmpty[x];
                if (type === LAND_TYPE) {
                    posToPutOn.push(x);
                }
            }
        }

        if (posToPutOn.length === 0) {
            dispatch(setUserfeedbackAction('must be near land to off-load'));
            return;
        }

        const clientAction: ExitTransportContainerAction = {
            type: INNER_TRANSPORT_PIECE_CLICK_ACTION,
            payload: {
                selectedPiece,
                containerPiece
            }
        };

        dispatch(clientAction);

        // TODO: could combine with above dispatch, maybe easier to separate
        const highlightPosAction: HighlightPositionsAction = {
            type: HIGHLIGHT_POSITIONS,
            payload: {
                highlightedPositions: posToPutOn
            }
        };

        dispatch(highlightPosAction);
        return;
    };
};
