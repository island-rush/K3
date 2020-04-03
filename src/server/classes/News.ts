import { RowDataPacket } from 'mysql2/promise';
// eslint-disable-next-line import/no-useless-path-segments
import { pool } from '../';
// import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { GameType, PieceType } from '../../types';

// gets pieces by team const gameboardPieces = await Piece.getVisiblePieces(game.gameId, gameTeam)

let typhoonCalled = false;
const percentageCalc = (percentage: number) => {
    let retVal = false;
    const result = Math.floor(Math.random() * 100);
    if (result < percentage) {
        retVal = true;
    }
    return retVal;
};

const checkTyphoonHit = async (gameId: GameType['gameId']) => {
    const listOfTyphoon: number[] = [];
    if (typhoonCalled === false) {
        typhoonCalled = true;
        // const queryString = 'SELECT pieceId, piecePositionId FROM pieces WHERE pieceGameId = ?';
        const queryString = 'SELECT pieceId, piecePositionId FROM pieces WHERE pieceGameId = ? AND piecePositionId IN (?) AND pieceTypeId IN (?)';
        // 120, 315 and 316 added for testing purposes
        const typhoonArea = [120, 285, 286, 287, 304, 305, 306, 307, 315, 316, 308, 326, 242, 361, 370, 373, 374, 375, 378, 388, 391, 392, 395, 405, 408, 409, 410, 411, 473, 474, 475, 490, 493, 506, 510, 524, 527, 528, 530, 540, 547, 558, 565, 575, 580, 593, 597, 608, 609, 610, 614, 627, 628, 629, 631, 645, 646, 647, 663, 680, 697, 713];
        const marineTypes = [13, 14, 15, 16];
        const inserts = [gameId, typhoonArea, marineTypes];

        type QueryResult = {
            pieceId: PieceType['pieceId'];
            positionId: PieceType['piecePositionId'];
        };
        const [results] = await pool.query<RowDataPacket[] & QueryResult[]>(queryString, inserts);

        if (results.length !== 0) {
            for (let x = 0; x < results.length; x++) {
                // each piece inside of the typhoon area has a ten percent chance of being deleted
                if (percentageCalc(10)) {
                    listOfTyphoon.push(results[x].pieceId);
                    const queryString = 'DELETE FROM pieces WHERE pieceId = ?';
                    const inserts = [results[x].pieceId];
                    await pool.query(queryString, inserts);
                }
            }
        }
    }
    // returned for debugging purposes
    return listOfTyphoon;
};

export const receiveNews = async (newsTitle: string, gameId: number) => {
    let retVal: any = [];
    switch (newsTitle) {
        case 'Apollo, Oh No! Solar Flare causes disruption.':
            return retVal;
        case 'Typhoon Lagoon':
            retVal = checkTyphoonHit(gameId);
            return retVal;
        case 'Tsunami!':
            return retVal;
        case 'April Showers Bring... Terror?':
            return retVal;
        case 'Who Put Coke in the JP-8?':
            return retVal;
        case 'Contanminated Water!':
            return retVal;
        case '"Have You Seen My Wrench?"':
            return retVal;
        case 'Diphtheria Oubreak':
            return retVal;
        case '***Breaking***':
            return retVal;
        case 'Volcanic Erupion':
            return retVal;
        case 'O2 System Failure':
            return retVal;
        case 'A Major Shake-up':
            return retVal;
        case 'Military Coup':
            return retVal;
        case 'Hurrican Kristin':
            return retVal;
        case 'Economic Recession Sweeps Region':
            return retVal;
        case 'From the STEM Column:':
            return retVal;
        case 'Is This the New "Military Amazon"?':
            return retVal;
        case "You've Heard of Bitcoin, But Have You Heard of RushCoin?":
            return retVal;
        case 'The Strike of Beep-Net':
            return retVal;
        default:
            return retVal;
    }
};

// export const checkTyphoonHit = async (gameId: GameType['gameId']): Promise<LIST_ALL_POSITIONS_TYPE[]> => {
//     const queryString =
//         'SELECT droneSwarmId, pieceId, positionId FROM droneSwarms INNER JOIN plans ON positionId = planPositionId INNER JOIN pieces ON planPieceId = pieceId WHERE pieceGameId = ? AND pieceTypeId in (?)';
//     const inserts = [gameId, [...LIST_ALL_PIECES]];
//     type QueryResult = {
//         droneSwarmId: DroneSwarmType['droneSwarmId'];
//         pieceId: PieceType['pieceId'];
//         positionId: PieceType['piecePositionId'];
//     };
//     const [results] = await pool.query<RowDataPacket[] & QueryResult[]>(queryString, inserts);

//     if (results.length !== 0) {
//         // delete the piece and try again
//         const pieceToDelete = await new Piece(results[0].pieceId).init();
//         pieceToDelete.delete();

//         const queryString = 'DELETE FROM droneSwarms WHERE droneSwarmId = ?';
//         const inserts = [results[0].droneSwarmId];
//         await pool.query(queryString, inserts);

//         const arrayOfPos = await checkDroneSwarmHit(gameId); // TODO: probably a better way instead of recursive, but makes sense here since we keep calling it until results.length == 0
//         arrayOfPos.push(results[0].positionId);
//         return arrayOfPos;
//     }

//     return []; // base case
// };

        // // only need to check distinct pieces, (100 red tanks in same position == 1 red tank in same position)
        // queryString = 'SELECT DISTINCT pieceTeamId, pieceTypeId, piecePositionId FROM pieces WHERE pieceGameId = ?';
        // inserts = [gameId];
        // const [pieces] = await conn.query<RowDataPacket[] & SubPieceType[]>(queryString, inserts);

        // let otherTeam;
        // for (let x = 0; x < pieces.length; x++) {
        //     const { pieceTeamId, pieceTypeId, piecePositionId } = pieces[x]; // TODO: pieces inside containers can't see rule?

        //     for (let type = 0; type < LIST_ALL_PIECES.length; type++) { // check each type
        //         const currentPieceType = LIST_ALL_PIECES[type];
        //         if (VISIBILITY_MATRIX[pieceTypeId][currentPieceType] !== -1) { // could it ever see this type?
        //             for (let position = 0; position < distanceMatrix[piecePositionId].length; position++) { // for all positions
        //                 if (distanceMatrix[piecePositionId][position] <= VISIBILITY_MATRIX[pieceTypeId][currentPieceType]) { // is this position in range for that type?
        //                     otherTeam = pieceTeamId === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

        //                     if (!posTypesVisible[otherTeam][type].includes(position)) { // add this position if not already added by another piece somewhere else
        //                         posTypesVisible[otherTeam][type].push(position);
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
