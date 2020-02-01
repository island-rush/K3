import React, { Component } from 'react';
import { ALL_AIRFIELD_LOCATIONS, DESTROYER_TYPE_ID, LIST_ALL_AIRFIELD_PIECES, MISSILE_TYPE_ID, TYPE_MOVES, TYPE_NAMES } from '../../../../constants';
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
    isSelected: boolean;
    pieceClick: any;
    pieceOpen: any;
    gameInfo: GameInfoState;
    confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
    confirmedMissileAttacks: CapabilitiesState['confirmedMissileAttacks'];
    confirmedBombardments: CapabilitiesState['confirmedBombardments'];
    confirmedMissileDisrupts: CapabilitiesState['confirmedMissileDisrupts'];
    bombardment: any;
}

export class Piece extends Component<Props> {
    render() {
        const {
            piece,
            isSelected,
            pieceClick,
            pieceOpen,
            confirmedMissileAttacks,
            gameInfo,
            confirmedAtcScramble,
            missileAttack,
            confirmedBombardments,
            confirmedMissileDisrupts,
            bombardment
        } = this.props;

        // TODO: top level probably not used anymore now that containers are their own popup
        const pieceCombinedStyle = {
            ...pieceStyle,
            ...topLevelStyle,
            ...zIndexLevels[isSelected ? 1 : 0],
            ...TYPE_IMAGES[piece.pieceTypeId],
            ...TYPE_TEAM_BORDERS[piece.pieceTeamId],
            ...(isSelected ? selectedStyle : ''),
            ...(piece.isPieceDisabled ? disabledStyle : '')
        };

        const disabledText = piece.isPieceDisabled ? `\nDisabled` : '';
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

        let missileDisruptText = '';
        if (confirmedMissileDisrupts.includes(piece.pieceId)) {
            missileDisruptText = '\nDisrupted by Cyber Attack!';
        }

        let targettedByMissileText = '';

        for (let x = 0; x < confirmedMissileAttacks.length; x++) {
            const currentMissileAttackObj = confirmedMissileAttacks[x];
            const { targetId, missileId } = currentMissileAttackObj;
            if (targetId === piece.pieceId) {
                targettedByMissileText = '\nTargetted By Missile';
            }
            if (missileId === piece.pieceId) {
                targettedByMissileText = '\nTargetting an enemy piece.';
            }
        }

        let targettingByBombardmentText = '';
        for (let x = 0; x < confirmedBombardments.length; x++) {
            const currentBombardmentObj = confirmedBombardments[x];
            const { targetId, destroyerId } = currentBombardmentObj;
            if (targetId === piece.pieceId) {
                targettedByMissileText = '\nTargetted By Bombardment';
            }
            if (destroyerId === piece.pieceId) {
                targettedByMissileText = '\nTargetting an enemy piece.';
            }
        }

        const title = `${
            TYPE_NAMES[piece.pieceTypeId]
        }${movesText}${fuelText}${disabledText}${landedText}${targettedByMissileText}${targettingByBombardmentText}${missileDisruptText}`;

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

        const bombardmentDoubleClick = (event: any) => {
            event.preventDefault();
            bombardment(piece);
            event.stopPropagation();
        };

        const onDoubleClick =
            piece.pieceTypeId === MISSILE_TYPE_ID
                ? missileAttackDoubleClick
                : piece.pieceTypeId === DESTROYER_TYPE_ID
                ? bombardmentDoubleClick
                : pieceOpenDoubleClick;

        return <div style={pieceCombinedStyle} title={title} onClick={onClick} onDoubleClick={onDoubleClick}></div>;
    }
}
