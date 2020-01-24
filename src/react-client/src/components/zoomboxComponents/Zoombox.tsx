import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GameboardMetaState, GameboardState, PieceType, GameInfoState, CapabilitiesState } from '../../../../types';
import { clearPieceSelection, pieceClose, pieceOpen, selectPiece, missileAttack } from '../../redux';
import { ZOOMBOX_BACKGROUNDS, TYPE_IMAGES } from '../styleConstants';
import { Piece } from './Piece';
import { SEA_MINES_TYPE_ID, DRONE_SWARMS_TYPE_ID } from '../../../../constants';

const zoomboxStyle = {
    position: 'absolute',
    left: '0%',
    bottom: '0%',
    height: '29%',
    width: '24%',
    boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 1) inset'
};

const invisibleStyle = {
    display: 'none'
};

const seaMineStyle = {
    backgroundColor: 'grey',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    width: '15%',
    height: '24%',
    boxShadow: '0px 0px 0px 2px rgba(70, 60, 50, .5) inset', // disabled style (for pieces)
    ...TYPE_IMAGES[SEA_MINES_TYPE_ID]
};

const droneSwarmStyle = {
    backgroundColor: 'grey',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    width: '15%',
    height: '24%',
    boxShadow: '0px 0px 0px 2px rgba(70, 60, 50, .5) inset', // disabled style (for pieces)
    ...TYPE_IMAGES[DRONE_SWARMS_TYPE_ID]
};

interface Props {
    selectedPos: number;
    selectedPiece: PieceType | null;
    gameboard: GameboardState;
    selectPiece: any;
    clearPieceSelection: any;
    pieceOpen: any;
    missileAttack: any;
    gameInfo: GameInfoState;
    confirmedSeaMines: CapabilitiesState['confirmedSeaMines'];
    confirmedDroneSwarms: CapabilitiesState['confirmedDroneSwarms'];
    confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
}

class Zoombox extends Component<Props> {
    render() {
        const {
            selectedPos,
            selectedPiece,
            gameboard,
            selectPiece,
            clearPieceSelection,
            pieceOpen,
            gameInfo,
            confirmedSeaMines,
            confirmedDroneSwarms,
            confirmedAtcScramble,
            missileAttack
        } = this.props;

        const isVisible = selectedPos !== -1;

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
                      gameInfo={gameInfo}
                      confirmedAtcScramble={confirmedAtcScramble}
                      // Shouldn't send this to all Piece components, only missiles (figure it out up here, not down there for everyone)
                      missileAttack={missileAttack}
                  />
              ));

        const seaMine = confirmedSeaMines.includes(selectedPos) ? <div style={seaMineStyle} title={'Sea Mine'} /> : null;
        const droneSwarm = confirmedDroneSwarms.includes(selectedPos) ? <div style={droneSwarmStyle} title={'Drone Swarm'} /> : null;

        const style = isVisible ? { ...zoomboxStyle, ...ZOOMBOX_BACKGROUNDS[gameboard[selectedPos].type] } : invisibleStyle;

        const onClick = (event: any) => {
            event.preventDefault();
            clearPieceSelection();
            event.stopPropagation();
        };

        return (
            <div style={style} onClick={onClick}>
                {pieces}
                {seaMine}
                {droneSwarm}
            </div>
        );
    }
}

const mapStateToProps = ({
    gameboard,
    gameboardMeta,
    gameInfo,
    capabilities
}: {
    gameboard: GameboardState;
    gameboardMeta: GameboardMetaState;
    gameInfo: GameInfoState;
    capabilities: CapabilitiesState;
}) => ({
    selectedPos: gameboardMeta.selectedPosition,
    selectedPiece: gameboardMeta.selectedPiece,
    gameboard,
    gameInfo,
    confirmedSeaMines: capabilities.confirmedSeaMines,
    confirmedDroneSwarms: capabilities.confirmedDroneSwarms,
    confirmedAtcScramble: capabilities.confirmedAtcScramble
});

const mapActionsToProps = {
    selectPiece: selectPiece,
    clearPieceSelection: clearPieceSelection,
    pieceOpen,
    pieceClose,
    missileAttack
};

export default connect(mapStateToProps, mapActionsToProps)(Zoombox);
