import React, { Component } from "react";
import { SELECTED_BORDERS, TYPE_IMAGES } from "../../styleConstants";

const tankerPieceStyle = {
    backgroundColor: "white",
    height: "15%",
    width: "96%",
    margin: "1%",
    padding: "1%",
    borderRadius: "2%"
};

const boxStyle = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "90% 90%",
    backgroundPosition: "center",
    border: "2px solid black",
    height: "92%",
    width: "23%",
    float: "left",
    margin: ".5%",
    position: "relative"
};

interface Props {
    tankerPiece: any;
    tankerPieceIndex: any;
    isSelected: any;
    tankerClick: any;
}

class TankerPiece extends Component<Props> {
    render() {
        const { tankerPiece, tankerPieceIndex, isSelected, tankerClick } = this.props;

        const removingFuel = tankerPiece.removedFuel != null ? tankerPiece.removedFuel : 0;

        const newTotalFuel = tankerPiece.pieceFuel - removingFuel;

        return (
            <div style={tankerPieceStyle}>
                <div
                    style={{
                        ...boxStyle,
                        ...TYPE_IMAGES[tankerPiece.pieceTypeId],
                        ...SELECTED_BORDERS[isSelected ? 0 : 1]
                    }}
                    onClick={event => {
                        event.preventDefault();
                        tankerClick(tankerPiece, tankerPieceIndex);
                        event.stopPropagation();
                    }}
                >
                    {tankerPieceIndex}
                </div>
                <p>CurrentFuel=[{tankerPiece.pieceFuel}] </p>
                <p>Removing=[{removingFuel}] </p>
                <p>NewTotal=[{newTotalFuel}]</p>
            </div>
        );
    }
}

export default TankerPiece;
