import React, { Component } from 'react';
import { ALL_AIRFIELD_LOCATIONS, LIST_ALL_AIRFIELD_PIECES, MISSILE_TYPE_ID, TYPE_MOVES, TYPE_NAMES } from '../../../../constants';
import { CapabilitiesState, GameInfoState, PieceType } from '../../../../types';
import { TYPE_IMAGES, TYPE_TEAM_BORDERS } from '../styleConstants';

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
    missileAttack: any;
    topLevel: boolean;
    selected: boolean;
    pieceClick: any;
    pieceOpen: any;
    gameInfo: GameInfoState;
    confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
}

export class Piece extends Component<Props> {
    render() {
        const { piece, topLevel, selected, pieceClick, pieceOpen, gameInfo, confirmedAtcScramble, missileAttack } = this.props;

        // TODO: top level probably not used anymore now that containers are their own popup
        const pieceCombinedStyle = {
            ...pieceStyle,
            ...(topLevel ? topLevelStyle : bottomLevelStyle),
            ...zIndexLevels[selected ? 1 : 0],
            ...TYPE_IMAGES[piece.pieceTypeId],
            ...TYPE_TEAM_BORDERS[piece.pieceTeamId],
            ...(selected ? selectedStyle : ''),
            ...(piece.pieceDisabled ? disabledStyle : '')
        };

        const disabledText = piece.pieceDisabled ? `\nDisabled` : '';
        const fuelText = piece.pieceFuel >= 0 ? `\nFuel: ${piece.pieceFuel}` : '';
        const movesText = TYPE_MOVES[piece.pieceTypeId] !== 0 ? `\nMoves: ${piece.pieceMoves}` : '';

        let landedText = '';

        if (ALL_AIRFIELD_LOCATIONS.includes(piece.piecePositionId)) {
            if (LIST_ALL_AIRFIELD_PIECES.includes(piece.pieceTypeId)) {
                const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(piece.piecePositionId);
                const airfieldOwner = (gameInfo as any)['airfield' + airfieldNum];
                if (airfieldOwner === piece.pieceTeamId) {
                    if (!confirmedAtcScramble.includes(piece.piecePositionId)) {
                        landedText = '\nLanded';
                    }
                }
            }
        }

        const title = `${TYPE_NAMES[piece.pieceTypeId]}${movesText}${fuelText}${disabledText}${landedText}`;

        const onClick = (event: any) => {
            event.preventDefault();
            pieceClick(piece);
            event.stopPropagation();
        };

        const pieceOpenDoubleClick = (event: any) => {
            event.preventDefault();
            pieceOpen(piece);
            event.stopPropagation();
        };

        const missileAttackDoubleClick = (event: any) => {
            event.preventDefault();
            missileAttack(piece);
            event.stopPropagation();
        };

        const onDoubleClick = piece.pieceTypeId === MISSILE_TYPE_ID ? missileAttackDoubleClick : pieceOpenDoubleClick;

        return <div style={pieceCombinedStyle} title={title} onClick={onClick} onDoubleClick={onDoubleClick}></div>;
    }
}
