import React, { Component, MouseEvent } from 'react';
import { TRANSPORT_TYPE_ID } from '../../../../../constants';
import { ContainerState, PieceType } from '../../../../../types';
import { ContainerPiece } from './ContainerPiece';

const containerPopupStyle: any = {
    position: 'absolute',
    display: 'block',
    width: '80%',
    height: '70%',
    top: '10%',
    right: '10%',
    backgroundColor: 'white',
    border: '2px solid black',
    zIndex: 4
};

const leftSectionStyle: any = {
    position: 'relative',
    overflow: 'scroll',
    float: 'left',
    backgroundColor: 'grey',
    height: '96%',
    width: '48%',
    margin: '1%'
};

const rightSectionStyle: any = {
    position: 'relative',
    overflow: 'scroll',
    backgroundColor: 'grey',
    height: '96%',
    width: '48%',
    float: 'right',
    margin: '1%'
};

const confirmButtonStyle: any = {
    position: 'absolute',
    display: 'block',
    width: '7%',
    height: '12%',
    top: '0%',
    left: '-8%',
    backgroundColor: 'white',
    border: '2px solid black',
    zIndex: 4,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
};

interface Props {
    container: ContainerState;
    pieceClose: any;
    outerPieceClick: any;
    innerPieceClick: any;
    innerTransportPieceClick: any;
}

export class ContainerPopup extends Component<Props> {
    render() {
        const { container, pieceClose, outerPieceClick, innerPieceClick, innerTransportPieceClick } = this.props;

        if (!container.isActive || container.isSelectingHex) {
            return null;
        }

        const outsidePieces = container.outerPieces.map((piece: PieceType, index: number) => (
            <ContainerPiece key={index} piece={piece} container={container} clickFunction={outerPieceClick} />
        ));

        const innerPieces =
            container.containerPiece == null || container.containerPiece.pieceContents == null
                ? null
                : container.containerPiece.pieceContents.pieces.map((piece: PieceType, index: number) => (
                      <ContainerPiece
                          key={index}
                          piece={piece}
                          container={container}
                          // TODO: try not to use these exclamations when possible (should properly check for nulls/undefineds)
                          clickFunction={container.containerPiece!.pieceTypeId === TRANSPORT_TYPE_ID ? innerTransportPieceClick : innerPieceClick}
                      />
                  ));

        const standardOnClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <div style={containerPopupStyle} onClick={standardOnClick}>
                <div style={leftSectionStyle}>
                    <div>Outer Pieces</div>
                    {outsidePieces}
                </div>
                <div style={rightSectionStyle}>
                    <div>Inner Pieces</div>
                    {innerPieces}
                </div>
                <div
                    onClick={event => {
                        event.preventDefault();
                        pieceClose();
                        event.stopPropagation();
                    }}
                    style={confirmButtonStyle}
                />
            </div>
        );
    }
}
