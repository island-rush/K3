import { Dispatch } from 'redux';
import { emit, FullState } from '../';
import { PIECE_CLICK, SEA_MINES_TYPE_ID, SERVER_SEA_MINE_CONFIRM } from '../../../../constants';
import { PieceClickAction, PieceType, SeaMineRequestAction } from '../../../../types';

/**
 * Change the state based on the piece that the user selected.
 */
export const selectPiece = (selectedPiece: PieceType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { planning } = getState();

        if (!planning.active) {
            const clientAction: PieceClickAction = {
                type: PIECE_CLICK,
                payload: {
                    selectedPiece
                }
            };

            dispatch(clientAction);
            return;
        }

        // else planning is active

        if (planning.invItem && planning.invItem.invItemTypeId === SEA_MINES_TYPE_ID) {
            // TODO: client side checks and prevent server side checks if something is obvious (like this piece needs to be a transport of this team, and other planning stuff)

            if (window.confirm('Are you sure you want to place your sea mine here?')) {
                const clientAction: SeaMineRequestAction = {
                    type: SERVER_SEA_MINE_CONFIRM,
                    payload: {
                        selectedPiece,
                        invItem: planning.invItem
                    }
                };

                sendToServer(clientAction);
            }
        }
    };
};
