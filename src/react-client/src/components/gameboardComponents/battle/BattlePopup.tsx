import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BattleState } from '../../../../../types';
//prettier-ignore
import { battlePieceClick, battlePopupMinimizeToggle, clearOldBattle, confirmBattleSelections, enemyBattlePieceClick, targetPieceClick } from "../../../redux";
import { BATTLE_POPUP_IMAGES } from '../../styleConstants';
import { BattlePiece } from './BattlePiece';

const battlePopupStyle: any = {
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

const battlePopupMinimizeStyle: any = {
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

const isMinimizedStyle: any = {
    border: '2px solid red',
    top: '35%',
    margin: '2%'
};

const leftBattleStyle: any = {
    position: 'relative',
    overflow: 'scroll',
    float: 'left',
    backgroundColor: 'grey',
    height: '96%',
    width: '48%',
    margin: '1%'
};

const rightBattleStyle: any = {
    position: 'relative',
    overflow: 'scroll',
    backgroundColor: 'grey',
    height: '96%',
    width: '48%',
    float: 'right',
    margin: '1%'
};

const battleButtonStyle: any = {
    position: 'absolute',
    bottom: '-7%',
    right: '2%'
};

const invisibleStyle: any = {
    display: 'none'
};

interface Props {
    battlePieceClick: any;
    enemyBattlePieceClick: any;
    targetPieceClick: any;
    confirmBattleSelections: any;
    battle: BattleState;
    clearOldBattle: any;
    battlePopupMinimizeToggle: any;
}

class BattlePopup extends Component<Props> {
    render() {
        // prettier-ignore
        const { battlePieceClick, enemyBattlePieceClick, targetPieceClick, confirmBattleSelections, battle, clearOldBattle, battlePopupMinimizeToggle } = this.props;

        const { selectedBattlePiece, friendlyPieces, enemyPieces } = battle;

        const friendlyBattlePieces = friendlyPieces.map((battlePiece: any, index: number) => (
            <BattlePiece
                isFriendly={true} //indicates left side battle piece functionality
                battlePieceClick={battlePieceClick}
                targetPieceClick={targetPieceClick}
                enemyBattlePieceClick={enemyBattlePieceClick}
                isSelected={battlePiece.piece.pieceId === selectedBattlePiece}
                key={index}
                battlePiece={battlePiece}
                battlePieceIndex={index}
            />
        ));

        // TODO: refactor BattlePiece components to have variable props instead of passing everything to both friendly and enemy (or have different props (but they have almost exact same style))
        const enemyBattlePieces = enemyPieces.map((battlePiece: any, index: number) => (
            <BattlePiece
                isFriendly={false} // indicates right side battle piece functionality
                battlePieceClick={battlePieceClick}
                targetPieceClick={targetPieceClick}
                enemyBattlePieceClick={enemyBattlePieceClick}
                isSelected={false} // never selected for that side
                key={index}
                battlePiece={battlePiece}
                battlePieceIndex={index}
            />
        ));

        return (
            // Overall Component
            <div style={battle.isActive ? null : invisibleStyle}>
                {/* Popup */}
                <div style={!battle.isMinimized ? battlePopupStyle : invisibleStyle}>
                    <div style={leftBattleStyle}>Friend{friendlyBattlePieces}</div>
                    <div style={rightBattleStyle}>Foe{enemyBattlePieces}</div>
                    <button
                        onClick={event => {
                            event.preventDefault();
                            if (battle.masterRecord != null) {
                                clearOldBattle();
                            } else {
                                confirmBattleSelections();
                            }
                            event.stopPropagation();
                        }}
                        style={battleButtonStyle}
                    >
                        {battle.masterRecord == null ? 'Confirm Selections' : 'Return to Battle'}
                    </button>
                    <div
                        onClick={event => {
                            event.preventDefault();
                            battlePopupMinimizeToggle();
                            event.stopPropagation();
                        }}
                        style={{ ...battlePopupMinimizeStyle, ...BATTLE_POPUP_IMAGES.minIcon }}
                    />
                </div>

                {/* Minimize Button on Left Side */}
                <div
                    style={{
                        ...(battle.isMinimized ? battlePopupMinimizeStyle : invisibleStyle),
                        ...BATTLE_POPUP_IMAGES.minIcon,
                        ...isMinimizedStyle
                    }}
                    onClick={event => {
                        event.preventDefault();
                        battlePopupMinimizeToggle();
                        event.stopPropagation();
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ battle }: { battle: BattleState }) => ({
    battle
});

const mapActionsToProps = {
    battlePieceClick,
    enemyBattlePieceClick,
    targetPieceClick,
    confirmBattleSelections,
    clearOldBattle,
    battlePopupMinimizeToggle
};

export default connect(mapStateToProps, mapActionsToProps)(BattlePopup);
