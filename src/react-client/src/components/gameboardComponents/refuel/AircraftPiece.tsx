import React, { Component } from 'react';
import { AIR_REFUELING_SQUADRON_ID, TYPE_FUEL } from '../../../constants/gameConstants';
import { TYPE_IMAGES } from '../../styleConstants';

const aircraftPieceStyle: any = {
    backgroundColor: 'white',
    height: '15%',
    width: '96%',
    margin: '1%',
    padding: '1%',
    borderRadius: '2%'
};

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

const textDivStyle: any = {
    position: 'relative',
    float: 'left'
};

interface Props {
    aircraftPiece: any;
    aircraftPieceIndex: number;
    aircraftClick: any;
    undoFuelSelection: any;
}

class AircraftPiece extends Component<Props> {
    render() {
        const { aircraftPiece, aircraftPieceIndex, aircraftClick, undoFuelSelection } = this.props;
        const { pieceFuel, pieceTypeId } = aircraftPiece;

        const tankerDisplay =
            aircraftPiece.tankerPieceIndex == null ? null : (
                <div
                    style={{ ...boxStyle, ...TYPE_IMAGES[AIR_REFUELING_SQUADRON_ID] }}
                    onClick={event => {
                        event.preventDefault();
                        undoFuelSelection(aircraftPiece, aircraftPieceIndex);
                        event.stopPropagation();
                    }}
                >
                    {aircraftPiece.tankerPieceIndex}
                </div>
            );

        const fuelToAdd = aircraftPiece.tankerPieceIndex == null ? 0 : TYPE_FUEL[aircraftPiece.pieceTypeId] - aircraftPiece.pieceFuel;

        return (
            <div style={aircraftPieceStyle}>
                <div
                    style={{
                        ...boxStyle,
                        ...TYPE_IMAGES[aircraftPiece.pieceTypeId]
                    }}
                    onClick={event => {
                        event.preventDefault();
                        aircraftClick(aircraftPiece, aircraftPieceIndex);
                        event.stopPropagation();
                    }}
                >
                    {aircraftPieceIndex}
                </div>
                <div style={textDivStyle}>
                    <p>Current Fuel=[{pieceFuel}]</p>
                    <p>Adding=[{fuelToAdd}] </p>
                    <p>Max=[{TYPE_FUEL[pieceTypeId]}]</p>
                </div>
                {tankerDisplay}
            </div>
        );
    }
}

export default AircraftPiece;
