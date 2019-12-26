import React, { Component } from 'react';
import { TYPE_NAMES } from '../../../../../constants';
import { ARROW_IMAGE, DICE_IMAGES, TYPE_IMAGES } from '../../styleConstants';

const battlePieceStyle: any = {
    backgroundColor: 'white',
    height: '15%',
    width: '96%',
    margin: '1%',
    padding: '1%',
    borderRadius: '2%'
};

//TODO: could probably refactor how this is called to a cleaner way...
const battlePieceWonStyle: any = [
    {},
    {
        border: '2px solid red'
    }
];

const boxStyle: any = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: '90% 90%',
    backgroundPosition: 'center',
    border: '2px solid black',
    height: '92%',
    width: '23%',
    float: 'left',
    margin: '.5%',
    position: 'relative'
};

const diceBoxStyle: any = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: '90% 90%',
    backgroundPosition: 'center',
    border: '2px solid black',
    height: '40%',
    width: '15%',
    float: 'left',
    margin: '.5%',
    position: 'relative'
};

const selected: any = [
    { border: '2px solid red' }, //selected
    { border: '2px solid black' } //not selected
];

interface Props {
    isFriendly: boolean;
    battlePieceClick: any;
    targetPieceClick: any;
    enemyBattlePieceClick: any;
    battlePiece: any;
    battlePieceIndex: any;
    isSelected: boolean;
}

class BattlePiece extends Component<Props> {
    render() {
        const { isFriendly, battlePieceClick, targetPieceClick, enemyBattlePieceClick, battlePiece, battlePieceIndex, isSelected } = this.props;

        const battlePieceBox = (
            <div
                title={TYPE_NAMES[battlePiece.piece.pieceTypeId]}
                onClick={event => {
                    event.preventDefault();
                    isFriendly ? battlePieceClick(battlePiece, battlePieceIndex) : enemyBattlePieceClick(battlePiece, battlePieceIndex);
                    event.stopPropagation();
                }}
                style={{
                    ...boxStyle,
                    ...TYPE_IMAGES[battlePiece.piece.pieceTypeId],
                    ...selected[isSelected ? 0 : 1]
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
                    onClick={event => {
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
            battlePiece.diceRoll == null ? null : (
                <div title={battlePiece.diceRoll1} style={{ ...diceBoxStyle, ...DICE_IMAGES[battlePiece.diceRoll1] }} />
            );

        const diceBox2 =
            battlePiece.diceRoll == null ? null : (
                <div title={battlePiece.diceRoll2} style={{ ...diceBoxStyle, ...DICE_IMAGES[battlePiece.diceRoll2] }} />
            );

        return (
            <div style={{ ...battlePieceStyle, ...battlePieceWonStyle[battlePiece.win != null && battlePiece.win ? 1 : 0] }}>
                {battlePieceBox}
                {arrowBox}
                {targetBox}
                {diceBox1}
                {diceBox2}
            </div>
        );
    }
}

export default BattlePiece;
