import React from "react";
import { TYPE_OWNER_NAMES } from "../../constants/gameConstants";

const gameinfoStyle: any = {
    backgroundColor: "Yellow",
    position: "absolute",
    height: "80%",
    width: "700%",
    marginLeft: "200%",
    marginTop: "20%"
};

const invisibleStyle = {
    display: "none"
};

interface Props {
    selected: boolean;
    gameInfo: any;
}

const Gameinfo = ({ selected, gameInfo }: Props) => {
    const { gameSection, gameInstructor, gameControllers, gamePhase, gameRound, gameSlice } = gameInfo;
    let gameControllerText = "";
    for (let x = 0; x < gameControllers.length; x++) {
        gameControllerText += TYPE_OWNER_NAMES[gameControllers[x]];
        if (x + 1 < gameControllers.length) {
            gameControllerText += ", ";
        }
    }

    return (
        <div style={selected ? gameinfoStyle : invisibleStyle}>
            Gameinfo
            <div>GameSection: {gameSection}</div>
            <div>GameInstructor: {gameInstructor}</div>
            <div>GameControllers: {gameControllerText}</div>
            <div>GamePhase: {gamePhase}</div>
            <div>GameRound: {gameRound}</div>
            <div>GameSlice: {gameSlice}</div>
        </div>
    );
};

export default Gameinfo;
