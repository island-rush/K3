import { Dispatch } from 'redux';
import { emit, FullState } from '../..';
import { AIR_REFUELING_SQUADRON_ID, ATTACK_HELICOPTER_TYPE_ID, PIECES_WITH_FUEL, REFUEL_OPEN } from '../../../../../constants';
import { PieceType, RefuelOpenAction } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to use open refuel popup.
 */
export const refuelOpen = (piece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo, gameboard } = getState();

        if (piece.pieceTeamId !== gameInfo.gameTeam) {
            dispatch(setUserfeedbackAction('piece does not belong to you'));
            return;
        }

        const { piecePositionId } = piece;

        const allPiecesInPosition = gameboard[piecePositionId].pieces;

        const tankers = [];
        const aircraft = [];

        for (const piece of allPiecesInPosition) {
            const { pieceTypeId } = piece;

            if (pieceTypeId === AIR_REFUELING_SQUADRON_ID) {
                tankers.push(piece);
            } else if (PIECES_WITH_FUEL.includes(pieceTypeId) && pieceTypeId !== ATTACK_HELICOPTER_TYPE_ID) {
                aircraft.push(piece);
            }
        }

        const refuelOpenAction: RefuelOpenAction = {
            type: REFUEL_OPEN,
            payload: {
                tankers,
                aircraft
            }
        };

        dispatch(refuelOpenAction);

        return;
    };
};
