import { AnyAction } from 'redux';
// prettier-ignore
import { ALL_GROUND_TYPES, distanceMatrix, initialGameboardEmpty, INNER_PIECE_CLICK_ACTION, INNER_TRANSPORT_PIECE_CLICK_ACTION, OUTER_PIECE_CLICK_ACTION, PIECE_CLOSE_ACTION, PIECE_OPEN_ACTION, TRANSPORT_TYPE_ID } from '../../../../constants';
// prettier-ignore
import { ContainerState, EnterContainerAction, ExitContainerAction, ExitTransportContainerAction, PieceOpenAction, PieceType } from '../../../../types';

const initialContainerState: ContainerState = {
    active: false,
    isSelectingHex: false,
    innerPieceToDrop: null,
    containerPiece: null,
    outerPieces: []
};

export function containerReducer(state = initialContainerState, action: AnyAction) {
    const { type } = action;

    let stateCopy: ContainerState = JSON.parse(JSON.stringify(state));

    switch (type) {
        case PIECE_OPEN_ACTION:
            stateCopy.active = true;
            stateCopy.containerPiece = (action as PieceOpenAction).payload.selectedPiece;
            let selectedPiecePosition = (action as PieceOpenAction).payload.selectedPiece.piecePositionId;
            let selectedPieceTypeId = (action as PieceOpenAction).payload.selectedPiece.pieceTypeId;

            //outerPieces is dependent on selectedPieceTypeId (surrounding land if transport...)
            //TODO: this can be cleaned up with modern for.each syntact -> for (let x of y)? something like that (it was used somewhere else so search for it)
            if (selectedPieceTypeId === TRANSPORT_TYPE_ID) {
                for (let x = 0; x < distanceMatrix[selectedPiecePosition].length; x++) {
                    //TODO: do we need a constant for '1'? transports can only pick up pieces from 1 hex away seems obvious
                    if (distanceMatrix[selectedPiecePosition][x] <= 1 && ALL_GROUND_TYPES.includes(initialGameboardEmpty[x].type)) {
                        //TODO: better way of combining arrays (no internet while i'm coding this mid-flight)
                        for (let y = 0; y < (action as PieceOpenAction).payload.gameboard[x].pieces.length; y++) {
                            //TODO: only put pieces here if they are able to get onto transport pieces
                            if (
                                (action as PieceOpenAction).payload.gameboard[x].pieces[y].pieceId ===
                                (action as PieceOpenAction).payload.selectedPiece.pieceId
                            )
                                continue;
                            stateCopy.outerPieces.push((action as PieceOpenAction).payload.gameboard[x].pieces[y]);
                        }
                    }
                }

                //now for each of those positions...
            } else {
                //other container types only look in their own position (probably...//TODO: write down the rules for this later )

                stateCopy.outerPieces = (action as PieceOpenAction).payload.gameboard[selectedPiecePosition].pieces.filter(
                    (piece: PieceType, index: number) => {
                        return piece.pieceId !== (action as PieceOpenAction).payload.selectedPiece.pieceId;
                    }
                );
            }
            return stateCopy;

        case PIECE_CLOSE_ACTION:
            stateCopy.active = false;
            stateCopy.containerPiece = null;
            stateCopy.outerPieces = [];
            stateCopy.isSelectingHex = false;
            stateCopy.innerPieceToDrop = null;
            return stateCopy;

        case INNER_TRANSPORT_PIECE_CLICK_ACTION:
            stateCopy.isSelectingHex = true;
            stateCopy.innerPieceToDrop = (action as ExitTransportContainerAction).payload.selectedPiece;
            return stateCopy;

        case OUTER_PIECE_CLICK_ACTION:
            //need the piece to go inside the container
            //remove from outerpieces
            //add to innerpieces
            stateCopy.outerPieces = stateCopy.outerPieces.filter((piece: PieceType, index: number) => {
                return piece.pieceId !== (action as EnterContainerAction).payload.selectedPiece.pieceId;
            });
            stateCopy.containerPiece.pieceContents.pieces.push((action as EnterContainerAction).payload.selectedPiece);
            return stateCopy;

        case INNER_PIECE_CLICK_ACTION:
            //need the piece to go outside the container
            //remove from the container piece
            //add to the outer pieces
            stateCopy.isSelectingHex = false;
            stateCopy.innerPieceToDrop = null;
            stateCopy.containerPiece.pieceContents.pieces = stateCopy.containerPiece.pieceContents.pieces.filter(
                (piece: PieceType, index: number) => {
                    return piece.pieceId !== (action as ExitContainerAction).payload.selectedPiece.pieceId;
                }
            );
            stateCopy.outerPieces.push((action as ExitContainerAction).payload.selectedPiece);
            return stateCopy;

        default:
            return state;
    }
}
