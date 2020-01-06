import React, { Component } from 'react';
import { TYPE_NAMES } from '../../../../constants';
import { TYPE_IMAGES, TYPE_TEAM_BORDERS } from '../styleConstants';
import { PieceType } from '../../../../types';

const pieceStyle = {
    backgroundColor: 'grey',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    position: 'relative'
};

const topLevelStyle = {
    width: '15%',
    height: '24%'
};

const bottomLevelStyle = {
    width: '48%',
    height: '48%'
};

const selectedStyle = {
    boxShadow: '0px 0px 0px 2px rgba(255, 255, 255, 0.8) inset'
};

const disabledStyle = {
    boxShadow: '0px 0px 0px 2px rgba(70, 60, 50, .5) inset'
};

const zIndexLevels = [{ zIndex: 5 }, { zIndex: 10 }];

interface Props {
    piece: PieceType;
    topLevel: boolean;
    selected: boolean;
    pieceClick: any;
    pieceOpen: any;
}

export class Piece extends Component<Props> {
    render() {
        const { piece, topLevel, selected, pieceClick, pieceOpen } = this.props;

        const pieceCombinedStyle = {
            ...pieceStyle,
            ...(topLevel ? topLevelStyle : bottomLevelStyle),
            ...zIndexLevels[selected ? 1 : 0],
            ...TYPE_IMAGES[piece.pieceTypeId],
            ...TYPE_TEAM_BORDERS[piece.pieceTeamId],
            ...(selected ? selectedStyle : ''),
            ...(piece.pieceDisabled ? disabledStyle : '')
        };

        const disabledText = piece.pieceDisabled ? `\nDisabled` : ``;

        const title = `${TYPE_NAMES[piece.pieceTypeId]}\nMoves: ${piece.pieceMoves}\nFuel: ${
            piece.pieceFuel !== -1 ? piece.pieceFuel : 'N/A'
        }${disabledText}`;

        const onClick = (event: any) => {
            event.preventDefault();
            pieceClick(piece);
            event.stopPropagation();
        };

        const onDoubleClick = (event: any) => {
            event.preventDefault();
            pieceOpen(piece);
            event.stopPropagation();
        };

        return <div style={pieceCombinedStyle} title={title} onClick={onClick} onDoubleClick={onDoubleClick}></div>;
    }
}
