import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GameboardMetaState, GameboardState, PieceType, GameInfoState, CapabilitiesState } from '../../../../types';
import { clearPieceSelection, pieceClose, pieceOpen, selectPiece } from '../../redux';
import { ZOOMBOX_BACKGROUNDS } from '../styleConstants';
import { Piece } from './Piece';

const zoomboxStyle = {
    position: 'absolute',
    left: '0%',
    bottom: '0%',
    height: '29%',
    width: '24%',
    boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 1) inset'
};

const invisibleStyle = {
    display: 'none'
};

interface Props {
    selectedPos: number;
    selectedPiece: PieceType | null;
    gameboard: GameboardState;
    selectPiece: any;
    clearPieceSelection: any;
    pieceOpen: any;
    gameInfo: GameInfoState;
    confirmedSeaMines: CapabilitiesState['confirmedSeaMines'];
}

class Zoombox extends Component<Props> {
    render() {
        const { selectedPos, selectedPiece, gameboard, selectPiece, clearPieceSelection, pieceOpen, gameInfo, confirmedSeaMines } = this.props;

        const isVisible = selectedPos !== -1;

        const pieces = !isVisible
            ? null
            : gameboard[selectedPos].pieces.map((piece: PieceType, index: number) => (
                  <Piece
                      pieceOpen={pieceOpen}
                      pieceClick={selectPiece}
                      selected={selectedPiece !== null && selectedPiece.pieceId === piece.pieceId}
                      topLevel={true}
                      key={index}
                      piece={piece}
                      gameInfo={gameInfo}
                  />
              ));

        // TODO: make sea mine actually look like a thing
        const seaMine = confirmedSeaMines.includes(selectedPos) ? <div>Sea Mine</div> : null;

        const style = isVisible ? { ...zoomboxStyle, ...ZOOMBOX_BACKGROUNDS[gameboard[selectedPos].type] } : invisibleStyle;

        const onClick = (event: any) => {
            event.preventDefault();
            clearPieceSelection();
            event.stopPropagation();
        };

        return (
            <div style={style} onClick={onClick}>
                {pieces}
                {seaMine}
            </div>
        );
    }
}

const mapStateToProps = ({
    gameboard,
    gameboardMeta,
    gameInfo,
    capabilities
}: {
    gameboard: GameboardState;
    gameboardMeta: GameboardMetaState;
    gameInfo: GameInfoState;
    capabilities: CapabilitiesState;
}) => ({
    selectedPos: gameboardMeta.selectedPosition,
    selectedPiece: gameboardMeta.selectedPiece,
    gameboard,
    gameInfo,
    confirmedSeaMines: capabilities.confirmedSeaMines
});

const mapActionsToProps = {
    selectPiece: selectPiece,
    clearPieceSelection: clearPieceSelection,
    pieceOpen,
    pieceClose
};

export default connect(mapStateToProps, mapActionsToProps)(Zoombox);
