import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ALL_AIRFIELD_LOCATIONS } from '../../../../constants';
import { GameboardMetaState, GameboardState, PieceType } from '../../../../types';
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

const airfieldStyle: any = {
    backgroundColor: 'yellow',
    margin: '1%',
    float: 'left',
    position: 'relative',
    height: '40%',
    width: '30%'
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
}

class Zoombox extends Component<Props> {
    render() {
        const { selectedPos, selectedPiece, gameboard, selectPiece, clearPieceSelection, pieceOpen } = this.props;

        const isVisible = selectedPos !== -1;

        const airfieldBox = !ALL_AIRFIELD_LOCATIONS.includes(selectedPos) ? null : (
            <div
                style={airfieldStyle}
                onDoubleClick={e => {
                    e.preventDefault();
                    alert('clicked to open airfield');
                    e.stopPropagation();
                }}
            >
                AIRFIELD
            </div>
        );

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
                  />
              ));

        const style = isVisible ? { ...zoomboxStyle, ...ZOOMBOX_BACKGROUNDS[gameboard[selectedPos].type] } : invisibleStyle;

        const onClick = (event: any) => {
            event.preventDefault();
            clearPieceSelection();
            event.stopPropagation();
        };

        return (
            <div style={style} onClick={onClick}>
                <div>{airfieldBox}</div>

                {pieces}
            </div>
        );
    }
}

const mapStateToProps = ({ gameboard, gameboardMeta }: { gameboard: GameboardState; gameboardMeta: GameboardMetaState }) => ({
    selectedPos: gameboardMeta.selectedPosition,
    selectedPiece: gameboardMeta.selectedPiece,
    gameboard
});

const mapActionsToProps = {
    selectPiece: selectPiece,
    clearPieceSelection: clearPieceSelection,
    pieceOpen,
    pieceClose
};

export default connect(mapStateToProps, mapActionsToProps)(Zoombox);
