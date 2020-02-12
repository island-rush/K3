import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
//prettier-ignore
import { AIRFIELD_TITLE, AIRFIELD_TYPE, ALL_AIRFIELD_LOCATIONS, ALL_FLAG_LOCATIONS, ALL_ISLAND_NAMES, BLUE_TEAM_ID, COMM_INTERRUPT_RANGE, distanceMatrix, FLAG_ISLAND_OWNERSHIP, GOLDEN_EYE_RANGE, IGNORE_TITLE_TYPES, ISLAND_POINTS, LIST_ALL_POSITIONS_TYPE, MISSILE_SILO_TITLE, MISSILE_SILO_TYPE, NUKE_RANGE, RED_TEAM_ID, REMOTE_SENSING_RANGE, TYPE_HIGH_LOW } from '../../../../constants';
// prettier-ignore
import { BattleState, CapabilitiesState, ContainerState, GameboardMetaState, GameboardPositionType, GameboardState, GameInfoState, NewsState, PlanningState } from '../../../../types';
//prettier-ignore
import { innerPieceClick, innerTransportPieceClick, newsPopupMinimizeToggle, outerPieceClick, pieceClose, raiseMoraleSelectCommanderType, selectPosition } from "../../redux";
import BattlePopup from './battle/BattlePopup';
import { SelectCommanderTypePopup } from './capabilities/SelectCommanderTypePopup';
import { ContainerPopup } from './container/ContainerPopup';
import { NewsPopup } from './NewsPopup';
import RefuelPopup from './refuel/RefuelPopup';
// import AirfieldPopup from './airfield/AirfieldPopup';
const { HexGrid, Layout, Hexagon, Pattern } = require('react-hexgrid'); // TODO: create type declaration for react-hexgrid, ability to import normally

const imageSize = { x: 3.4, y: 2.75 };
const positionImagesPath = './images/positionImages/';

const gameboardStyle: any = {
    backgroundColor: 'b9b9b9',
    width: '94%',
    height: '88%',
    top: '0%',
    right: '0%',
    position: 'absolute'
};

const subDivStyle = {
    height: '100%',
    width: '100%'
};

//These functions organize the hexagons into the proper rows/columns to make the shape of the board (based on the index of the position (0->726))
const qIndexSolver = (index: LIST_ALL_POSITIONS_TYPE) => {
    if (index < 81) {
        //above zoombox
        if (index % 27 < 14) {
            //even or odd column
            return Math.floor(index / 27) * 2;
        } else {
            return Math.floor(index / 27) * 2 + 1;
        }
    } else {
        //beyond zoombox
        if ((index - 81) % 34 < 17) {
            return (Math.floor((index - 81) / 34) + 3) * 2;
        } else {
            return (Math.floor((index - 81) / 34) + 3) * 2 + 1;
        }
    }
};

const rIndexSolver = (index: LIST_ALL_POSITIONS_TYPE) => {
    if (index < 81) {
        if (index % 27 < 14) {
            return (index % 27) - Math.floor(index / 27);
        } else {
            return (index % 27) - Math.floor(index / 27) - 14;
        }
    } else {
        if ((index - 81) % 34 < 17) {
            return ((index - 81) % 34) - (Math.floor((index - 81) / 34) + 3);
        } else {
            return ((index - 81) % 34) - (Math.floor((index - 81) / 34) + 3) - 17;
        }
    }
};

const patternSolver = (
    position: any,
    gameInfo: GameInfoState,
    positionIndex: LIST_ALL_POSITIONS_TYPE,
    confirmedAtcScramble: CapabilitiesState['confirmedAtcScramble'],
    confirmedNukes: CapabilitiesState['confirmedNukes']
) => {
    const { type } = position; //position comes from the gameboard state

    let listOfNukePositions = [];
    for (let x = 0; x < confirmedNukes.length; x++) {
        let thisNukeCenter = confirmedNukes[x];
        for (let y = 0; y < distanceMatrix[thisNukeCenter].length; y++) {
            if (distanceMatrix[thisNukeCenter][y] <= NUKE_RANGE) {
                listOfNukePositions.push(y);
            }
        }
    }

    if (listOfNukePositions.includes(positionIndex)) {
        return `${type}_nuke`;
    }

    if (ALL_FLAG_LOCATIONS.includes(positionIndex)) {
        const flagNum = ALL_FLAG_LOCATIONS.indexOf(positionIndex);
        const islandOwner: GameInfoState['flag0'] = gameInfo[`flag${flagNum}`];
        const finalType = islandOwner === BLUE_TEAM_ID ? 'blueflag' : islandOwner === RED_TEAM_ID ? 'redflag' : 'flag';

        return finalType;
    }

    if (ALL_AIRFIELD_LOCATIONS.includes(positionIndex)) {
        const airfieldNum = ALL_AIRFIELD_LOCATIONS.indexOf(positionIndex);
        const airfieldOwner: GameInfoState['airfield0'] = gameInfo[`airfield${airfieldNum}`]; // TODO: should use actual types instead of any here
        const finalType = airfieldOwner === BLUE_TEAM_ID ? 'blueairfield' : airfieldOwner === RED_TEAM_ID ? 'redairfield' : 'airfield';
        if (confirmedAtcScramble.includes(positionIndex)) {
            return `${finalType}_disabled`;
        }
        return finalType;
    }

    return type; //This resolves what image is shown on the board (see ./images/positionImages)
};

const hasPieceType = (
    position: GameboardPositionType,
    highLow: 'top' | 'bottom',
    team: 'blue' | 'red',
    confirmedSeaMines: CapabilitiesState['confirmedSeaMines'],
    confirmedDroneSwarms: CapabilitiesState['confirmedDroneSwarms'],
    gameInfo: GameInfoState,
    positionIndex: LIST_ALL_POSITIONS_TYPE
) => {
    const { pieces } = position;
    const { highPieces, lowPieces } = TYPE_HIGH_LOW;
    const highLowToCheck = highLow === 'top' ? highPieces : lowPieces;
    const blueRedToCheck = team === 'blue' ? BLUE_TEAM_ID : RED_TEAM_ID;
    if (pieces) {
        for (const piece of pieces) {
            if (piece.pieceTeamId === blueRedToCheck && highLowToCheck.includes(piece.pieceTypeId)) {
                return true;
            }
        }
    }

    if (highLow === 'bottom' && confirmedSeaMines.includes(positionIndex)) {
        const teamVar = gameInfo.gameTeam === BLUE_TEAM_ID ? 'blue' : gameInfo.gameTeam === RED_TEAM_ID ? 'red' : '';
        if (teamVar !== team) {
            return true;
        }
    }

    if (highLow === 'top' && confirmedDroneSwarms.includes(positionIndex)) {
        const teamVar = gameInfo.gameTeam === BLUE_TEAM_ID ? 'blue' : gameInfo.gameTeam === RED_TEAM_ID ? 'red' : '';
        if (teamVar !== team) {
            return true;
        }
    }

    return false;
};

const titleSolver = (position: GameboardPositionType, positionIndex: LIST_ALL_POSITIONS_TYPE) => {
    const { type } = position;
    //ignore titles for types 'land' and 'water'

    if (IGNORE_TITLE_TYPES.includes(type)) {
        return '';
    }

    if (!ALL_FLAG_LOCATIONS.includes(positionIndex)) {
        //No points info, simple titles
        switch (type) {
            case AIRFIELD_TYPE:
                return AIRFIELD_TITLE;
            case MISSILE_SILO_TYPE:
                return MISSILE_SILO_TITLE;
            default:
                return '';
        }
    }

    //need to display island name, and island point value
    const islandNum = FLAG_ISLAND_OWNERSHIP[positionIndex];
    const islandTitle = ALL_ISLAND_NAMES[islandNum];

    return `Island Flag\n${islandTitle}\nPoints: ${ISLAND_POINTS[islandNum]}`;
};

interface Props {
    gameInfo: GameInfoState;
    gameboard: GameboardState;
    gameboardMeta: GameboardMetaState;
    capabilities: CapabilitiesState;
    planning: PlanningState;
    battle: BattleState;
    container: ContainerState;
    news: NewsState;
    selectPosition: any;
    newsPopupMinimizeToggle: any;
    raiseMoraleSelectCommanderType: any;
    pieceClose: any;
    outerPieceClick: any;
    innerPieceClick: any;
    innerTransportPieceClick: any;
}

class Gameboard extends Component<Props> {
    render() {
        const {
            gameInfo,
            gameboard,
            gameboardMeta,
            planning,
            battle,
            container,
            news,
            capabilities,
            selectPosition,
            newsPopupMinimizeToggle,
            raiseMoraleSelectCommanderType,
            pieceClose,
            outerPieceClick,
            innerPieceClick,
            innerTransportPieceClick
        } = this.props;

        //prettier-ignore
        const { selectedPosition, selectedPiece, highlightedPositions } = gameboardMeta;
        //prettier-ignore
        const { samHitPos, confirmedAntiSatHitPos, confirmedBombardmentHitPos, confirmedMissileHitPos, confirmedAtcScramble, confirmedBioWeapons, confirmedCommInterrupt, confirmedGoldenEye, confirmedInsurgency, confirmedRemoteSense, confirmedRods, confirmedSeaMines, seaMineHits, confirmedDroneSwarms, droneSwarmHits, confirmedNukes } = capabilities;

        const { confirmedPlans } = planning;

        let planningPositions: any = []; //all of the positions part of a plan
        let battlePositions: any = []; //position(s) involved in a battle
        let remoteSensedPositions: any = [];
        let commInterruptPositions: any = [];
        let goldenEyePositions: any = [];

        for (let x = 0; x < planning.moves.length; x++) {
            const positionId = planning.moves[x];

            if (!planningPositions.includes(positionId)) {
                planningPositions.push(positionId);
            }
        }

        if (selectedPiece !== null) {
            if (selectedPiece.pieceId in confirmedPlans) {
                for (let z = 0; z < confirmedPlans[selectedPiece.pieceId].length; z++) {
                    const positionId = confirmedPlans[selectedPiece.pieceId][z];
                    planningPositions.push(positionId);
                }
            }
        }

        if (battle.isActive) {
            if (battle.friendlyPieces.length > 0) {
                let { piecePositionId } = battle.friendlyPieces[0].piece;
                battlePositions.push(piecePositionId);
            }
            if (battle.enemyPieces.length > 0) {
                let { piecePositionId } = battle.enemyPieces[0].piece;
                battlePositions.push(piecePositionId);
            }
        }

        for (let x = 0; x < confirmedRemoteSense.length; x++) {
            //need the adjacent by 3 radius positions to be highlighted
            let remoteSenseCenter = confirmedRemoteSense[x];
            for (let y = 0; y < distanceMatrix[remoteSenseCenter].length; y++) {
                if (distanceMatrix[remoteSenseCenter][y] <= REMOTE_SENSING_RANGE) {
                    remoteSensedPositions.push(y);
                }
            }
        }

        for (let x = 0; x < confirmedCommInterrupt.length; x++) {
            let commInterruptCenter = confirmedCommInterrupt[x];
            for (let y = 0; y < distanceMatrix[commInterruptCenter].length; y++) {
                if (distanceMatrix[commInterruptCenter][y] <= COMM_INTERRUPT_RANGE) {
                    commInterruptPositions.push(y);
                }
            }
        }

        for (let x = 0; x < confirmedGoldenEye.length; x++) {
            let goldenEyeCenter = confirmedGoldenEye[x];
            for (let y = 0; y < distanceMatrix[goldenEyeCenter].length; y++) {
                if (distanceMatrix[goldenEyeCenter][y] <= GOLDEN_EYE_RANGE) {
                    goldenEyePositions.push(y);
                }
            }
        }

        const positions = Object.keys(gameboard).map((positionIndex: string) => {
            const positionId = parseInt(positionIndex) as LIST_ALL_POSITIONS_TYPE;
            return (
                <Hexagon
                    key={positionIndex}
                    posId={0}
                    q={qIndexSolver(positionId)}
                    r={rIndexSolver(positionId)}
                    s={-999}
                    fill={patternSolver(gameboard[positionId], gameInfo, positionId as LIST_ALL_POSITIONS_TYPE, confirmedAtcScramble, confirmedNukes)}
                    // TODO: change this to always selectPositon(positionindex), instead of sending -1 (more info for the action, let it take care of it)
                    onClick={(event: MouseEvent) => {
                        event.preventDefault();
                        selectPosition(positionId);
                        event.stopPropagation();
                    }}
                    //These are found in the Game.css
                    // TODO: highlight according to some priority list
                    className={
                        selectedPosition === positionId
                            ? 'selectedPos'
                            : planningPositions.includes(positionId)
                            ? 'plannedPos'
                            : highlightedPositions.includes(positionId)
                            ? 'highlightedPos'
                            : battlePositions.includes(positionId)
                            ? 'battlePos'
                            : confirmedRods.includes(positionId)
                            ? 'battlePos'
                            : confirmedBioWeapons.includes(positionId)
                            ? 'bioWeaponPos'
                            : confirmedInsurgency.includes(positionId)
                            ? 'battlePos'
                            : remoteSensedPositions.includes(positionId)
                            ? 'remoteSensePos'
                            : commInterruptPositions.includes(positionId)
                            ? 'commInterruptPos'
                            : goldenEyePositions.includes(positionId)
                            ? 'goldenEyePos'
                            : seaMineHits.includes(positionId)
                            ? 'goldenEyePos' // TODO: change to different style for sea mine indication
                            : droneSwarmHits.includes(positionId)
                            ? 'goldenEyePos' // TODO: change to different style for drone swarm indication
                            : confirmedMissileHitPos.includes(positionId)
                            ? 'goldenEyePos' // TODO: change to different style for missile attack (success)
                            : confirmedBombardmentHitPos.includes(positionId)
                            ? 'goldenEyePos' // TODO: it's own position highlight style
                            : confirmedAntiSatHitPos.includes(positionId)
                            ? 'goldenEyePos' // TODO: it's own color / style
                            : samHitPos.includes(positionId)
                            ? 'goldenEyePos' // TODO: make it different
                            : ''
                    }
                    // TODO: pass down what the highlighting means into the title
                    title={titleSolver(gameboard[positionId], positionId)}
                    topBlue={hasPieceType(gameboard[positionId], 'top', 'blue', confirmedSeaMines, confirmedDroneSwarms, gameInfo, positionId)}
                    bottomBlue={hasPieceType(gameboard[positionId], 'bottom', 'blue', confirmedSeaMines, confirmedDroneSwarms, gameInfo, positionId)}
                    topRed={hasPieceType(gameboard[positionId], 'top', 'red', confirmedSeaMines, confirmedDroneSwarms, gameInfo, positionId)}
                    bottomRed={hasPieceType(gameboard[positionId], 'bottom', 'red', confirmedSeaMines, confirmedDroneSwarms, gameInfo, positionId)}
                />
            );
        });

        const standardOnClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <div style={gameboardStyle} onClick={standardOnClick}>
                <div style={subDivStyle}>
                    <HexGrid width={'100%'} height={'100%'} viewBox="-50 -50 100 100">
                        <Layout size={{ x: 3.15, y: 3.15 }} flat={true} spacing={1.03} origin={{ x: -98, y: -46 }}>
                            {positions}
                        </Layout>
                        <Pattern id="land" link={positionImagesPath + 'land.png'} size={imageSize} />
                        <Pattern id="land_nuke" link={positionImagesPath + 'land_nuke.png'} size={imageSize} />
                        <Pattern id="water" link={positionImagesPath + 'water.png'} size={imageSize} />
                        <Pattern id="water_nuke" link={positionImagesPath + 'water_nuke.png'} size={imageSize} />
                        <Pattern id="flag" link={positionImagesPath + 'flag.png'} size={imageSize} />
                        <Pattern id="flag_nuke" link={positionImagesPath + 'flag_nuke.png'} size={imageSize} />
                        <Pattern id="redflag" link={positionImagesPath + 'redflag.png'} size={imageSize} />
                        <Pattern id="blueflag" link={positionImagesPath + 'blueflag.png'} size={imageSize} />
                        <Pattern id="airfield" link={positionImagesPath + 'airfield.png'} size={imageSize} />
                        <Pattern id="airfield_nuke" link={positionImagesPath + 'airfield_nuke.png'} size={imageSize} />
                        <Pattern id="airfield_disabled" link={positionImagesPath + 'airfield_disabled.png'} size={imageSize} />
                        <Pattern id="blueairfield" link={positionImagesPath + 'blueairfield.png'} size={imageSize} />
                        <Pattern id="redairfield" link={positionImagesPath + 'redairfield.png'} size={imageSize} />
                        <Pattern id="redairfield_disabled" link={positionImagesPath + 'redairfield_disabled.png'} size={imageSize} />
                        <Pattern id="blueairfield_disabled" link={positionImagesPath + 'blueairfield_disabled.png'} size={imageSize} />
                        <Pattern id="missile" link={positionImagesPath + 'missile.png'} size={imageSize} />
                        <Pattern id="missile_nuke" link={positionImagesPath + 'missile_nuke.png'} size={imageSize} />
                    </HexGrid>
                </div>

                {/* TODO: more parent level connect to redux, less children connect, pass down relevant functions from here (try not to mix redux and parent passing) */}
                <NewsPopup news={news} newsPopupMinimizeToggle={newsPopupMinimizeToggle} />
                <BattlePopup />
                <RefuelPopup />
                <SelectCommanderTypePopup planning={planning} raiseMoraleSelectCommanderType={raiseMoraleSelectCommanderType} />
                <ContainerPopup
                    innerTransportPieceClick={innerTransportPieceClick}
                    innerPieceClick={innerPieceClick}
                    outerPieceClick={outerPieceClick}
                    container={container}
                    pieceClose={pieceClose}
                />
            </div>
        );
    }
}

const mapStateToProps = ({
    gameboard,
    gameboardMeta,
    gameInfo,
    capabilities,
    planning,
    battle,
    container,
    news
}: {
    gameboard: GameboardState;
    gameboardMeta: GameboardMetaState;
    gameInfo: GameInfoState;
    capabilities: CapabilitiesState;
    planning: PlanningState;
    battle: BattleState;
    container: ContainerState;
    news: NewsState;
}) => ({
    gameboard,
    gameboardMeta,
    gameInfo,
    capabilities,
    planning,
    battle,
    container,
    news
});

const mapActionsToProps = {
    selectPosition,
    newsPopupMinimizeToggle,
    raiseMoraleSelectCommanderType,
    pieceClose,
    outerPieceClick,
    innerPieceClick,
    innerTransportPieceClick
};

export default connect(mapStateToProps, mapActionsToProps)(Gameboard);
