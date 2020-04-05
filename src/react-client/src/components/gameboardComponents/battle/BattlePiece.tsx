import { Properties } from 'csstype';
import React, { Component } from 'react';
import { ATTACK_MATRIX, TYPE_NAMES } from '../../../../../constants';
import { BattlePieceStateType } from '../../../../../types';
import { battlePieceClick, enemyBattlePieceClick, targetPieceClick } from '../../../redux';
import { ARROW_IMAGE, DICE_IMAGES, SELECTED_BORDERS, TYPE_IMAGES } from '../../styleConstants';

const battlePieceStyle: Properties = {
    backgroundColor: 'white',
    height: '15%',
    width: '96%',
    margin: '1%',
    padding: '1%',
    borderRadius: '2%',
};

// TODO: could probably refactor how this is called to a cleaner way...
const battlePieceWonStyle: Properties[] = [
    {},
    {
        border: '2px solid red',
    },
];

const boxStyle: Properties = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: '90% 90%',
    backgroundPosition: 'center',
    border: '2px solid black',
    height: '92%',
    width: '23%',
    float: 'left',
    margin: '.5%',
    position: 'relative',
};

const diceBoxStyle: Properties = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: '90% 90%',
    backgroundPosition: 'center',
    border: '2px solid black',
    height: '40%',
    width: '15%',
    float: 'left',
    margin: '.5%',
    position: 'relative',
};

interface Props {
    isFriendly: boolean;
    isSelected: boolean;
    battlePieceClick: typeof battlePieceClick;
    targetPieceClick: typeof targetPieceClick;
    enemyBattlePieceClick: typeof enemyBattlePieceClick;
    battlePiece: BattlePieceStateType;
    battlePieceIndex: number;
}

export class BattlePiece extends Component<Props> {
    render() {
        const { isFriendly, battlePieceClick, targetPieceClick, enemyBattlePieceClick, battlePiece, battlePieceIndex, isSelected } = this.props;

        const battlePieceBox = (
            <div
                title={TYPE_NAMES[battlePiece.piece.pieceTypeId]}
                onClick={(event) => {
                    event.preventDefault();
                    isFriendly ? battlePieceClick(battlePiece, battlePieceIndex) : enemyBattlePieceClick(battlePiece, battlePieceIndex);
                    event.stopPropagation();
                }}
                style={{
                    ...boxStyle,
                    ...TYPE_IMAGES[battlePiece.piece.pieceTypeId],
                    ...SELECTED_BORDERS[isSelected ? 0 : 1],
                }}
            >
                {battlePieceIndex}
            </div>
        );

        const arrowBox = battlePiece.targetPiece == null ? null : <div title={'Attacking'} style={{ ...boxStyle, ...ARROW_IMAGE }} />;

        const targetBox =
            battlePiece.targetPiece == null ? null : (
                <div
                    title={TYPE_NAMES[battlePiece.targetPiece.pieceTypeId]}
                    onClick={(event) => {
                        event.preventDefault();
                        targetPieceClick(battlePiece, battlePieceIndex);
                        event.stopPropagation();
                    }}
                    style={{ ...boxStyle, ...TYPE_IMAGES[battlePiece.targetPiece.pieceTypeId] }}
                >
                    {battlePiece.targetPieceIndex}
                </div>
            );

        const diceBox1 =
            battlePiece.diceRoll1 == null ? null : (
                <div title={`${battlePiece.diceRoll1}`} style={{ ...diceBoxStyle, ...DICE_IMAGES[battlePiece.diceRoll1] }} />
            );

        const diceBox2 =
            battlePiece.diceRoll2 == null ? null : (
                <div title={`${battlePiece.diceRoll2}`} style={{ ...diceBoxStyle, ...DICE_IMAGES[battlePiece.diceRoll2] }} />
            );

        const neededValue =
            battlePiece.targetPiece == null || battlePiece.win !== undefined ? null : (
                <div>
                    {ATTACK_MATRIX[battlePiece.piece.pieceTypeId][battlePiece.targetPiece.pieceTypeId] !== 0
                        ? `Need: ${ATTACK_MATRIX[battlePiece.piece.pieceTypeId][battlePiece.targetPiece.pieceTypeId]}`
                        : 'No Hit Value'}
                </div>
            );

        return (
            <div style={{ ...battlePieceStyle, ...battlePieceWonStyle[battlePiece.win != null && battlePiece.win ? 1 : 0] }}>
                {battlePieceBox}
                {arrowBox}
                {targetBox}
                {neededValue}
                {diceBox1}
                {diceBox2}
            </div>
        );
    }
}
