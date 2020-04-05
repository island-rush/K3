import { Properties } from 'csstype';
import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { RefuelState } from '../../../../../types';
import { aircraftClick, confirmFuelSelections, refuelPopupMinimizeToggle, tankerClick, undoFuelSelection } from '../../../redux';
import { LEFT_CONTROLS_IMAGES } from '../../styleConstants';
import { AircraftPiece } from './AircraftPiece';
import { TankerPiece } from './TankerPiece';

const refuelPopupStyle: Properties = {
    position: 'absolute',
    display: 'block',
    width: '80%',
    height: '80%',
    top: '10%',
    right: '10%',
    backgroundColor: 'white',
    border: '2px solid black',
    zIndex: 4,
};

const refuelPopupMinimizeStyle: Properties = {
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
    backgroundRepeat: 'no-repeat',
};

const leftSectionStyle: Properties = {
    position: 'relative',
    overflow: 'scroll',
    float: 'left',
    backgroundColor: 'grey',
    height: '96%',
    width: '48%',
    margin: '1%',
};

const rightSectionStyle: Properties = {
    position: 'relative',
    overflow: 'scroll',
    backgroundColor: 'grey',
    height: '96%',
    width: '48%',
    float: 'right',
    margin: '1%',
};

const confirmButtonStyle: Properties = {
    position: 'absolute',
    bottom: '-7%',
    right: '2%',
};

interface Props {
    refuel: RefuelState;
    confirmFuelSelections: any;
    aircraftClick: any;
    tankerClick: any;
    undoFuelSelection: any;
    refuelPopupMinimizeToggle: any;
}

class RefuelPopup extends Component<Props> {
    render() {
        const { refuel, confirmFuelSelections, aircraftClick, tankerClick, undoFuelSelection, refuelPopupMinimizeToggle } = this.props;

        const { tankers, aircraft, selectedTankerPieceId, isActive } = refuel;

        if (!isActive) {
            return null;
        }

        const tankerPieces = tankers.map((tankerPiece: any, index: number) => (
            <TankerPiece
                key={index}
                tankerPiece={tankerPiece}
                tankerPieceIndex={index}
                isSelected={selectedTankerPieceId === tankerPiece.pieceId}
                tankerClick={tankerClick}
            />
        ));

        const aircraftPieces = aircraft.map((aircraftPiece: any, index: number) => (
            <AircraftPiece
                key={index}
                aircraftPiece={aircraftPiece}
                aircraftPieceIndex={index}
                undoFuelSelection={undoFuelSelection}
                aircraftClick={aircraftClick}
            />
        ));

        const standardOnClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            // Overall Component
            <div style={refuelPopupStyle} onClick={standardOnClick}>
                <div style={leftSectionStyle}>
                    Aircraft
                    {aircraftPieces}
                </div>
                <div style={rightSectionStyle}>
                    Tankers
                    {tankerPieces}
                </div>
                <button
                    onClick={(event) => {
                        event.preventDefault();
                        confirmFuelSelections();
                        event.stopPropagation();
                    }}
                    style={confirmButtonStyle}
                >
                    Confirm Fuel Selections
                </button>
                <div
                    onClick={(event) => {
                        event.preventDefault();
                        refuelPopupMinimizeToggle();
                        event.stopPropagation();
                    }}
                    style={{ ...refuelPopupMinimizeStyle, ...LEFT_CONTROLS_IMAGES.cancel }}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ refuel }: { refuel: RefuelState }) => ({
    refuel,
});

const mapActionsToProps = {
    confirmFuelSelections,
    tankerClick,
    aircraftClick,
    undoFuelSelection,
    refuelPopupMinimizeToggle,
};

export default connect(mapStateToProps, mapActionsToProps)(RefuelPopup);
