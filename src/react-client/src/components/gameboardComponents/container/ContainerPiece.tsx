import React from 'react';
import { TYPE_NAMES } from '../../../../../constants';
import { ContainerState, PieceType } from '../../../../../types';
import { TYPE_IMAGES, TYPE_TEAM_BORDERS } from '../../styleConstants';

const containerPieceStyle: any = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: '90% 90%',
    backgroundPosition: 'center',
    border: '2px solid black',
    height: '15%',
    width: '15%',
    float: 'left',
    margin: '.5%',
    position: 'relative'
};

interface Props {
    piece: PieceType;
    container: ContainerState;
    clickFunction: any;
}

export function ContainerPiece({ piece, container, clickFunction }: Props) {
    return (
        <div
            style={{ ...containerPieceStyle, ...TYPE_IMAGES[piece.pieceTypeId], ...TYPE_TEAM_BORDERS[piece.pieceTeamId] }}
            onClick={event => {
                event.preventDefault();
                clickFunction(piece, container.containerPiece);
                event.stopPropagation();
            }}
            title={TYPE_NAMES[piece.pieceTypeId]}
        />
    );
}
