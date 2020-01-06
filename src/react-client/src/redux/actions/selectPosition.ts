import { Dispatch } from 'redux';
import { emit, FullState } from '../';
// prettier-ignore
import { BIOLOGICAL_WEAPONS_TYPE_ID, COMMUNICATIONS_INTERRUPTION_TYPE_ID, COMM_INTERRUPT_RANGE, distanceMatrix, GOLDEN_EYE_RANGE, GOLDEN_EYE_TYPE_ID, HIGHLIGHT_POSITIONS, initialGameboardEmpty, INSURGENCY_TYPE_ID, PLANNING_SELECT, POSITION_SELECT, REMOTE_SENSING_RANGE, REMOTE_SENSING_TYPE_ID, RODS_FROM_GOD_TYPE_ID, SERVER_BIOLOGICAL_WEAPONS_CONFIRM, SERVER_COMM_INTERRUPT_CONFIRM, SERVER_GOLDEN_EYE_CONFIRM, SERVER_INNER_TRANSPORT_PIECE_CLICK, SERVER_INSURGENCY_CONFIRM, SERVER_REMOTE_SENSING_CONFIRM, SERVER_RODS_FROM_GOD_CONFIRM, TYPE_TERRAIN } from '../../../../constants';
//prettier-ignore
import { BioWeaponsRequestAction, CommInterruptRequestAction, ExitTransportContainerRequestAction, GoldenEyeRequestAction, HighlightPositionsAction, InsurgencyRequestAction, PlanningSelectAction, PositionSelectAction, RemoteSensingRequestAction, RodsFromGodRequestAction } from "../../../../types";
import { setUserfeedbackAction } from './setUserfeedbackAction';

type PositionCapabilityRequestAction =
    | RodsFromGodRequestAction
    | RemoteSensingRequestAction
    | InsurgencyRequestAction
    | BioWeaponsRequestAction
    | CommInterruptRequestAction
    | GoldenEyeRequestAction;

/**
 * Change the state based on position that was clicked by the user.
 */
export const selectPosition = (selectedPositionId: number) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameboardMeta, planning, container } = getState();

        //selecting the hex to put piece that is inside container
        if (container.isSelectingHex) {
            //TODO: check that the position selected was valid
            //TODO: check that the position was vaild (on the server side)

            //other checks
            const thisAction: ExitTransportContainerRequestAction = {
                type: SERVER_INNER_TRANSPORT_PIECE_CLICK,
                payload: {
                    selectedPiece: container.innerPieceToDrop!,
                    // TODO: don't assume this exists
                    containerPiece: container.containerPiece!,
                    selectedPositionId
                }
            };

            sendToServer(thisAction);

            return;
        }

        if (!planning.active) {
            //select anything and highlight, looking at the position

            const thisAction: PositionSelectAction = {
                type: POSITION_SELECT,
                payload: {
                    selectedPositionId
                }
            };

            dispatch(thisAction);
            return;
        }

        //is actively planning
        if (selectedPositionId === -1 && !planning.capability) {
            dispatch(setUserfeedbackAction('Must select a position for the plan...'));
            return;
        }

        //Currently for 'rods from god' but will likely be used for other capabilities (non-piece selections on the board (with planning))
        if (planning.capability) {
            //highlight if needed
            if (planning.invItem && planning.invItem.invItemTypeId === REMOTE_SENSING_TYPE_ID) {
                let clickedPosition = selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition;
                let highlightedPositions: number[] = [];
                for (let x = 0; x < distanceMatrix[clickedPosition].length; x++) {
                    if (distanceMatrix[clickedPosition][x] <= REMOTE_SENSING_RANGE) {
                        highlightedPositions.push(x);
                    }
                }

                const highlightAction: HighlightPositionsAction = {
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions
                    }
                };

                dispatch(highlightAction);
            }

            if (planning.invItem && planning.invItem.invItemTypeId === COMMUNICATIONS_INTERRUPTION_TYPE_ID) {
                let clickedPosition = selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition;
                let highlightedPositions: number[] = [];
                for (let x = 0; x < distanceMatrix[clickedPosition].length; x++) {
                    if (distanceMatrix[clickedPosition][x] <= COMM_INTERRUPT_RANGE) highlightedPositions.push(x);
                }

                const highlightAction: HighlightPositionsAction = {
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions
                    }
                };

                dispatch(highlightAction);
            }

            if (planning.invItem && planning.invItem.invItemTypeId === GOLDEN_EYE_TYPE_ID) {
                let clickedPosition = selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition;
                let highlightedPositions = [];
                for (let x = 0; x < distanceMatrix[clickedPosition].length; x++) {
                    if (distanceMatrix[clickedPosition][x] <= GOLDEN_EYE_RANGE) highlightedPositions.push(x);
                }

                const highlightAction: HighlightPositionsAction = {
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions
                    }
                };

                dispatch(highlightAction);
            }

            // eslint-disable-next-line no-restricted-globals
            if (planning.invItem && confirm('Are you sure you want to use capability on this position?')) {
                //TODO: figure out better way of typecasting the 'type' for this action (could be many types)
                let type:
                    | typeof SERVER_RODS_FROM_GOD_CONFIRM
                    | typeof SERVER_REMOTE_SENSING_CONFIRM
                    | typeof SERVER_INSURGENCY_CONFIRM
                    | typeof SERVER_BIOLOGICAL_WEAPONS_CONFIRM
                    | typeof SERVER_COMM_INTERRUPT_CONFIRM
                    | typeof SERVER_GOLDEN_EYE_CONFIRM;
                switch (planning.invItem.invItemTypeId) {
                    case RODS_FROM_GOD_TYPE_ID:
                        type = SERVER_RODS_FROM_GOD_CONFIRM;
                        break;
                    case REMOTE_SENSING_TYPE_ID:
                        type = SERVER_REMOTE_SENSING_CONFIRM;
                        break;
                    case INSURGENCY_TYPE_ID:
                        type = SERVER_INSURGENCY_CONFIRM;
                        break;
                    case BIOLOGICAL_WEAPONS_TYPE_ID:
                        type = SERVER_BIOLOGICAL_WEAPONS_CONFIRM;
                        break;
                    case COMMUNICATIONS_INTERRUPTION_TYPE_ID:
                        type = SERVER_COMM_INTERRUPT_CONFIRM;
                        break;
                    case GOLDEN_EYE_TYPE_ID:
                        type = SERVER_GOLDEN_EYE_CONFIRM;
                        break;
                    default:
                        dispatch(setUserfeedbackAction('unkown/not yet implemented invItemTypeId functionality (capability)'));
                        return;
                }

                //TODO: frontend action to change into a 'waiting on server' state?
                const highlightAction: HighlightPositionsAction = {
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions: []
                    }
                };

                dispatch(highlightAction);

                const clientAction: PositionCapabilityRequestAction = {
                    type,
                    payload: {
                        selectedPositionId: selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition,
                        invItem: planning.invItem
                    }
                };

                sendToServer(clientAction);
                return;
            }

            //select the position anyway
            const positionSelectAction: PositionSelectAction = {
                type: POSITION_SELECT,
                payload: {
                    selectedPositionId: selectedPositionId !== -1 ? selectedPositionId : gameboardMeta.selectedPosition
                }
            };

            dispatch(positionSelectAction);
            return;
        }

        let trueMoveCount = 0;
        for (var i = 0; i < planning.moves.length; i++) {
            const { type } = planning.moves[i];
            if (type === 'move') {
                trueMoveCount++;
            }
        }

        if (gameboardMeta.selectedPiece && trueMoveCount >= gameboardMeta.selectedPiece.pieceMoves) {
            dispatch(setUserfeedbackAction('Must move piece within range...'));
            return;
        }

        //from the selected position or the last move in the plan?
        const lastSelectedPosition =
            planning.moves.length > 0 ? planning.moves[planning.moves.length - 1].positionId : gameboardMeta.selectedPosition;

        if (distanceMatrix[lastSelectedPosition][selectedPositionId] !== 1) {
            dispatch(setUserfeedbackAction('Must select adjacent position...'));
            return;
        }

        //if we are planning (a non-capability), we assume there is a selectedPiece in the meta
        // @ts-ignore -> TODO: better null checking here instead of assuming it exists
        const { pieceTypeId } = gameboardMeta.selectedPiece;
        const { type } = initialGameboardEmpty[selectedPositionId];
        if (!TYPE_TERRAIN[pieceTypeId].includes(type)) {
            dispatch(setUserfeedbackAction('Wrong terrain type for this piece...'));
            return;
        }

        const planningSelectAction: PlanningSelectAction = {
            type: PLANNING_SELECT,
            payload: {
                selectedPositionId
            }
        };

        dispatch(planningSelectAction);
    };
};
