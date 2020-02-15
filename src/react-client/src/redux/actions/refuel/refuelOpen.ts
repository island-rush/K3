import { Dispatch } from 'redux';
import { emit, FullState } from '../..';
// prettier-ignore
import { AIR_REFUELING_SQUADRON_ID, ATTACK_HELICOPTER_TYPE_ID, COMBAT_PHASE_ID, PIECES_WITH_FUEL, TYPE_AIR, WAITING_STATUS } from '../../../../../constants';
import { PieceType, RefuelOpenAction, REFUEL_OPEN } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

/**
 * Action to use open refuel popup.
 */
export const refuelOpen = (piece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo, gameboard } = getState();

        const { gameControllers, gameStatus, gamePhase } = gameInfo;

        if (!gameControllers.includes(TYPE_AIR)) {
            dispatch(setUserfeedbackAction('must be air commander to do refueling'));
            return;
        }

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('must be combat phase to open air refuel.'));
            return;
        }

        // TODO: better messages for this
        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already confirmed waiting for other team.'));
            return;
        }

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
