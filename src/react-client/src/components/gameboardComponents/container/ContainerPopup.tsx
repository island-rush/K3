import React, { Component } from 'react';
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

const invisibleStyle: any = {
    display: 'none'
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

        //Don't need to check for null (probably should) since empty array is still valid
        const outsidePieces = container.outerPieces.map((piece: PieceType, index: number) => (
            <ContainerPiece key={index} piece={piece} container={container} clickFunction={outerPieceClick} />
        ));

        const innerPieces =
            container.containerPiece === null
                ? null
                : container.containerPiece.pieceContents.pieces.map((piece: PieceType, index: number) => (
                      <ContainerPiece
                          key={index}
                          piece={piece}
                          container={container}
                          //could need extra stuff for tanks in transport (need extra step to select the hex to go in)
                          clickFunction={container.containerPiece.pieceTypeId === TRANSPORT_TYPE_ID ? innerTransportPieceClick : innerPieceClick}
                      />
                  ));

        return (
            <div style={container.active && !container.isSelectingHex ? containerPopupStyle : invisibleStyle}>
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
