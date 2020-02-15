import { Dispatch } from 'redux';
import { emit, FullState } from '../';
// prettier-ignore
import { ATC_SCRAMBLE_TYPE_ID, BIOLOGICAL_WEAPONS_TYPE_ID, COMMUNICATIONS_INTERRUPTION_TYPE_ID, COMM_INTERRUPT_RANGE, distanceMatrix, DRONE_SWARMS_TYPE_ID, GOLDEN_EYE_RANGE, GOLDEN_EYE_TYPE_ID, HIGHLIGHT_POSITIONS, initialGameboardEmpty, INSURGENCY_TYPE_ID, MISSILE_LAUNCH_DISRUPTION_TYPE_ID, NUCLEAR_STRIKE_TYPE_ID, NUKE_RANGE, PLANNING_SELECT, POSITION_SELECT, REMOTE_SENSING_RANGE, REMOTE_SENSING_TYPE_ID, RODS_FROM_GOD_TYPE_ID, SEA_MINES_TYPE_ID, SERVER_ATC_SCRAMBLE_CONFIRM, SERVER_BIOLOGICAL_WEAPONS_CONFIRM, SERVER_COMM_INTERRUPT_CONFIRM, SERVER_GOLDEN_EYE_CONFIRM, SERVER_INNER_TRANSPORT_PIECE_CLICK, SERVER_INSURGENCY_CONFIRM, SERVER_NUKE_CONFIRM, SERVER_REMOTE_SENSING_CONFIRM, SERVER_RODS_FROM_GOD_CONFIRM, TYPE_TERRAIN, NO_POSITION, LIST_ALL_POSITIONS_TYPE, SERVER_PIECE_PLACE, LIST_ALL_POSITIONS } from '../../../../constants';
//prettier-ignore
import { AtcScrambleRequestAction, BioWeaponsRequestAction, CommInterruptRequestAction, ExitTransportContainerRequestAction, GoldenEyeRequestAction, HighlightPositionsAction, InsurgencyRequestAction, NukeRequestAction, PlanningSelectAction, PositionSelectAction, RemoteSensingRequestAction, RodsFromGodRequestAction, InvItemPlaceRequestAction } from "../../../../types";
import { setUserfeedbackAction } from './setUserfeedbackAction';

/**
 * Change the state based on position that was clicked by the user.
 */
export const selectPosition = (selectedPositionId: LIST_ALL_POSITIONS_TYPE) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameboardMeta, planning, container } = getState();

        if (planning.isActive && planning.placementSelecting && LIST_ALL_POSITIONS.includes(selectedPositionId)) {
            // TODO: could do client side checks for terrain and other simple things...

            const clientAction: InvItemPlaceRequestAction = {
                type: SERVER_PIECE_PLACE,
                payload: {
                    invItemId: planning.placementSelecting.invItemId,
                    selectedPosition: selectedPositionId
                }
            };
            sendToServer(clientAction);
            return;
        }

        //selecting the hex to put piece that is inside container
        if (container.isSelectingHex) {
            // TODO: check that the position selected was valid
            // TODO: check that the position was vaild (on the server side)

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

        if (!planning.isActive) {
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

        //is actively planning // TODO: this file and comment doesn't make much sense, refactor
        if (selectedPositionId === NO_POSITION && !planning.isUsingCapability) {
            dispatch(setUserfeedbackAction('Must select a position for the plan...'));
            return;
        }

        //Currently for 'rods from god' but will likely be used for other capabilities (non-piece selections on the board (with planning))
        if (planning.isUsingCapability) {
            //highlight if needed
            if (planning.invItem && planning.invItem.invItemTypeId === REMOTE_SENSING_TYPE_ID) {
                let clickedPosition = selectedPositionId !== NO_POSITION ? selectedPositionId : gameboardMeta.selectedPosition;
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
                let clickedPosition = selectedPositionId !== NO_POSITION ? selectedPositionId : gameboardMeta.selectedPosition;
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
                let clickedPosition = selectedPositionId !== NO_POSITION ? selectedPositionId : gameboardMeta.selectedPosition;
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

            if (planning.invItem && planning.invItem.invItemTypeId === NUCLEAR_STRIKE_TYPE_ID) {
                let clickedPosition = selectedPositionId !== NO_POSITION ? selectedPositionId : gameboardMeta.selectedPosition;
                let highlightedPositions = [];
                for (let x = 0; x < distanceMatrix[clickedPosition].length; x++) {
                    if (distanceMatrix[clickedPosition][x] <= NUKE_RANGE) highlightedPositions.push(x);
                }

                const highlightAction: HighlightPositionsAction = {
                    type: HIGHLIGHT_POSITIONS,
                    payload: {
                        highlightedPositions
                    }
                };

                dispatch(highlightAction);
            }

            setTimeout(() => {
                if (
                    planning.invItem &&
                    planning.invItem.invItemTypeId !== SEA_MINES_TYPE_ID &&
                    planning.invItem.invItemTypeId !== MISSILE_LAUNCH_DISRUPTION_TYPE_ID &&
                    planning.invItem.invItemTypeId !== DRONE_SWARMS_TYPE_ID &&
                    window.confirm('Are you sure you want to use capability on this position?')
                ) {
                    let type: PositionCapabilityRequestAction['type'];
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
                        case NUCLEAR_STRIKE_TYPE_ID:
                            type = SERVER_NUKE_CONFIRM;
                            break;
                        case ATC_SCRAMBLE_TYPE_ID:
                            type = SERVER_ATC_SCRAMBLE_CONFIRM;
                            break;
                        default:
                            dispatch(setUserfeedbackAction('unkown/not yet implemented invItemTypeId functionality (capability)'));
                            return;
                    }

                    // TODO: frontend action to change into a 'waiting on server' state?
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
                            selectedPositionId: selectedPositionId !== NO_POSITION ? selectedPositionId : gameboardMeta.selectedPosition,
                            invItem: planning.invItem
                        }
                    };

                    sendToServer(clientAction);
                    return;
                }
            }, 375); // TODO: possibly make this time a constant

            //select the position anyway
            const positionSelectAction: PositionSelectAction = {
                type: POSITION_SELECT,
                payload: {
                    selectedPositionId: selectedPositionId !== NO_POSITION ? selectedPositionId : gameboardMeta.selectedPosition
                }
            };

            dispatch(positionSelectAction);
            return;
        }

        if (planning.missileSelecting || planning.bombardmentSelecting) {
            //select the position anyway
            const positionSelectAction: PositionSelectAction = {
                type: POSITION_SELECT,
                payload: {
                    selectedPositionId: selectedPositionId !== NO_POSITION ? selectedPositionId : gameboardMeta.selectedPosition
                }
            };

            dispatch(positionSelectAction);
            return;
        }

        let trueMoveCount = 0;
        for (var i = 0; i < planning.moves.length; i++) {
            trueMoveCount++;
        }

        if (gameboardMeta.selectedPiece && trueMoveCount >= gameboardMeta.selectedPiece.pieceMoves) {
            dispatch(setUserfeedbackAction('Must move piece within range...'));
            return;
        }

        //from the selected position or the last move in the plan?
        const lastSelectedPosition = planning.moves.length > 0 ? planning.moves[planning.moves.length - 1] : gameboardMeta.selectedPosition;

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
        return;
    };
};

type PositionCapabilityRequestAction =
    | RodsFromGodRequestAction
    | RemoteSensingRequestAction
    | InsurgencyRequestAction
    | AtcScrambleRequestAction
    | NukeRequestAction
    | BioWeaponsRequestAction
    | CommInterruptRequestAction
    | GoldenEyeRequestAction;
