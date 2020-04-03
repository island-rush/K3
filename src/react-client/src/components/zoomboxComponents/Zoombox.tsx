import { Properties } from 'csstype';
import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { DRONE_SWARMS_TYPE_ID, LIST_ALL_POSITIONS_TYPE, SEA_MINES_TYPE_ID } from '../../../../constants';
import { CapabilitiesState, GameboardMetaState, GameboardState, GameInfoState, PieceType } from '../../../../types';
import { bombardment, clearPieceSelection, missileAttack, pieceOpen, refuelOpen, selectPiece } from '../../redux';
import { TYPE_IMAGES, ZOOMBOX_BACKGROUNDS } from '../styleConstants';
import { Piece } from './Piece';

const zoomboxStyle: Properties = {
    position: 'absolute',
    left: '0%',
    bottom: '0%',
    height: '29%',
    width: '24%',
    boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 1) inset',
};

const seaMineStyle: Properties = {
    backgroundColor: 'grey',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    width: '15%',
    height: '24%',
    boxShadow: '0px 0px 0px 2px rgba(70, 60, 50, .5) inset', // disabled style (for pieces)
    ...TYPE_IMAGES[SEA_MINES_TYPE_ID],
};

const droneSwarmStyle: Properties = {
    backgroundColor: 'grey',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    width: '15%',
    height: '24%',
    boxShadow: '0px 0px 0px 2px rgba(70, 60, 50, .5) inset', // disabled style (for pieces)
    ...TYPE_IMAGES[DRONE_SWARMS_TYPE_ID],
};

interface Props {
    selectedPos: LIST_ALL_POSITIONS_TYPE;
    selectedPiece: PieceType | null;
    gameboard: GameboardState;
    selectPiece: any;
    clearPieceSelection: any;
    pieceOpen: any;
    missileAttack: any; // TODO: make these actual function types (import the types? (like typeof: missileAttack?))
    bombardment: any;
    refuelOpen: any;
    gameInfo: GameInfoState;
    confirmedSeaMines: CapabilitiesState['confirmedSeaMines'];
    confirmedDroneSwarms: CapabilitiesState['confirmedDroneSwarms'];
    confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'];
    confirmedMissileAttacks: CapabilitiesState['confirmedMissileAttacks'];
    confirmedBombardments: CapabilitiesState['confirmedBombardments'];
    confirmedMissileDisrupts: CapabilitiesState['confirmedMissileDisrupts'];
}

class Zoombox extends Component<Props> {
    render() {
        // prettier-ignore
        const { refuelOpen, selectedPos, selectedPiece, gameboard, selectPiece, clearPieceSelection, pieceOpen, gameInfo, confirmedSeaMines, confirmedDroneSwarms, confirmedAtcScramble, confirmedMissileAttacks, confirmedMissileDisrupts, missileAttack, confirmedBombardments, bombardment } = this.props;

        // hide if no position selected
        if (selectedPos === -1) {
            return null;
        }

        const pieceComponents = gameboard[selectedPos].pieces.map((piece: PieceType, index: number) => (
            <Piece
                key={index}
                piece={piece}
                isSelected={selectedPiece !== null && selectedPiece.pieceId === piece.pieceId}
                pieceClick={selectPiece}
                pieceOpen={pieceOpen}
                confirmedMissileAttacks={confirmedMissileAttacks} // TODO: probably better way of figuring this out (instead of passing the whole list down below)
                confirmedMissileDisrupts={confirmedMissileDisrupts}
                gameInfo={gameInfo}
                confirmedAtcScramble={confirmedAtcScramble}
                missileAttack={missileAttack} // TODO: Shouldn't send this to all Piece components, only missiles (figure it out up here, not down there for everyone)
                confirmedBombardments={confirmedBombardments}
                bombardment={bombardment}
                refuelOpen={refuelOpen}
            />
        ));

        const seaMineDiv = confirmedSeaMines.includes(selectedPos) ? <div style={seaMineStyle} title={'Sea Mine'} /> : null;

        const droneSwarmDiv = confirmedDroneSwarms.includes(selectedPos) ? <div style={droneSwarmStyle} title={'Drone Swarm'} /> : null;

        const style = { ...zoomboxStyle, ...ZOOMBOX_BACKGROUNDS[gameboard[selectedPos].type] };

        const onClick = (event: MouseEvent) => {
            event.preventDefault();
            clearPieceSelection();
            event.stopPropagation();
        };

        return (
            <div style={style} onClick={onClick}>
                {pieceComponents}
                {seaMineDiv}
                {droneSwarmDiv}
            </div>
        );
    }
}

// prettier-ignore
const mapStateToProps = ({ gameboard, gameboardMeta, gameInfo, capabilities }: { gameboard: GameboardState; gameboardMeta: GameboardMetaState; gameInfo: GameInfoState; capabilities: CapabilitiesState; }) => ({
    selectedPos: gameboardMeta.selectedPosition,
    selectedPiece: gameboardMeta.selectedPiece,
    gameboard,
    gameInfo,
    confirmedSeaMines: capabilities.confirmedSeaMines,
    confirmedDroneSwarms: capabilities.confirmedDroneSwarms,
    confirmedAtcScramble: capabilities.confirmedAtcScramble,
    confirmedMissileAttacks: capabilities.confirmedMissileAttacks,
    confirmedBombardments: capabilities.confirmedBombardments,
    confirmedMissileDisrupts: capabilities.confirmedMissileDisrupts
});

const mapActionsToProps = {
    selectPiece: selectPiece,
    clearPieceSelection: clearPieceSelection,
    pieceOpen,
    missileAttack,
    bombardment,
    refuelOpen,
};

export default connect(mapStateToProps, mapActionsToProps)(Zoombox);
