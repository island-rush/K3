import { RowDataPacket, OkPacket } from 'mysql2/promise';
import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { typhoonArea } from '../../constants/news';
// eslint-disable-next-line import/no-useless-path-segments
import { pool } from '../';
import { Piece } from '.';
// import { LIST_ALL_POSITIONS_TYPE } from '../../constants';
import { GameType, PieceType, NewsEffectType } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// let currentNewsId = -1;
let typhoonCalled = false;
const TYPHOON_ROUNDS = 3;

type CurrentNewsEffect = {
    newsEffectId: number,
    effectedPositions: number[],
    effectedPieces: number[]
};

let currentNewsEffect: CurrentNewsEffect;

export const getNewsEffect = async () => {
    const listOfNewsEffect: LIST_ALL_POSITIONS_TYPE[] = [];

    return listOfNewsEffect;
};

// insert isPieceDisabled pieces into the newsEffectPieces database table
const disableEffectedPiece = async (pieceId: number, newsEffectId: number) => {
    if (newsEffectId >= 0) {
        const inserts = [newsEffectId, pieceId];
        // TODO add NewsEffectElementId to this insert
        const queryString = 'INSERT INTO newsEffectPieces (newsEffectId, pieceId) VALUES (?,?)';
        const [results] = await pool.query<OkPacket>(queryString, inserts);
        await new Piece(pieceId).init();
        console.log(results);
    }
};

// // Cannot set a disabled position in the newsEffectPieces table because of foreign key pointing to pieceId
// const setDisabledPosition = async (positionId: number, newsEffectId: number) => {
//     const inserts = [newsEffectId, positionId];
//     const queryString = 'INSERT INTO newsEffectPositions (newsEffectId, positionId) VALUES (?,?)';
//     const [results] = await pool.query<OkPacket>(queryString, inserts);
//     console.log(results);
// };

const getNewsIds = (checkResults: RowDataPacket[] & NewsEffectType[]) => {
    const newsIds = [];
    for (let x = 0; x < checkResults.length; x++) {
        newsIds.push(checkResults[x].newsId);
    }
    return newsIds;
};

// insert newsEffect into NewsEffect table before possibly inserting disabled pieces into newsEffectPieces table
const insertNewsEffect = async (newsEffectGameId: GameType['gameId'], newsId: number, roundsLeft: number) => {
    const checkQueryString = 'SELECT * FROM newsEffects WHERE newsId = ? AND newsEffectGameId = ?';
    const checkInserts = [newsId, newsEffectGameId];
    const [checkResults] = await pool.query<RowDataPacket[] & NewsEffectType[]>(checkQueryString, checkInserts);

    // if (checkResults.length > 0) {
        const newsIds = getNewsIds(checkResults);
        if (!newsIds.includes(newsId)) {
            const queryString = 'INSERT INTO newsEffects (newsId, newsEffectGameId, roundsLeft) VALUES (?,?,?)';
            const inserts = [newsId, newsEffectGameId, roundsLeft];
            const [results] = await pool.query<OkPacket>(queryString, inserts);
            return results.insertId;
        }
    // }
    return -1;
};

const checkTyphoonHit = async (gameId: GameType['gameId'], newsId: number, newsEffectId: number) => {
    const listOfTyphoon: LIST_ALL_POSITIONS_TYPE[] = [];
    if (typhoonCalled === false) {
        typhoonCalled = true;
        // const queryString = 'SELECT pieceId, piecePositionId FROM pieces WHERE pieceGameId = ?';
        const queryString = 'SELECT pieceId, piecePositionId FROM pieces WHERE pieceGameId = ? AND piecePositionId IN (?) AND pieceTypeId IN (?)';
        // 120, 315 and 316 added to typhoonArea for testing purposes
        // const typhoonArea = [120, 285, 286, 287, 304, 305, 306, 307, 315, 316, 308, 326, 242, 361, 370, 373, 374, 375, 378, 388, 391, 392, 395, 405, 408, 409, 410, 411, 473, 474, 475, 490, 493, 506, 510, 524, 527, 528, 530, 540, 547, 558, 565, 575, 580, 593, 597, 608, 609, 610, 614, 627, 628, 629, 631, 645, 646, 647, 663, 680, 697, 713];
        const marineTypes = [13, 14, 15, 16];
        const inserts = [gameId, typhoonArea, marineTypes];

        type QueryResult = {
            pieceId: PieceType['pieceId'];
            positionId: PieceType['piecePositionId'];
        };
        const [results] = await pool.query<RowDataPacket[] & QueryResult[]>(queryString, inserts);

        // Disable selected pieces for
        if (results.length !== 0 && newsEffectId >= 0) {
            results.forEach(async (resultItem) => {
                listOfTyphoon.push(resultItem.pieceId);
                const { pieceId } = resultItem;
                await disableEffectedPiece(pieceId, newsEffectId);
            });
        }
        currentNewsEffect.effectedPositions = typhoonArea;
        currentNewsEffect.effectedPieces = listOfTyphoon;
    }
    // returned for debugging purposes
    return listOfTyphoon;
};

export const receiveNews = async (newsTitle: string, gameId: number, newsId: number) => {
    let retVal: any;
    currentNewsEffect = {
        newsEffectId: newsId,
        effectedPieces: [],
        effectedPositions: []
    };
    // currentNewsId = newsId;
    let newsEffectId = -1;
    switch (newsTitle) {
        case 'Apollo, Oh No! Solar Flare causes disruption.':
            newsEffectId = await insertNewsEffect(gameId, newsId, TYPHOON_ROUNDS);
            retVal = checkTyphoonHit(gameId, newsId, newsEffectId);
            return retVal;
        case 'Typhoon Lagoon':
            newsEffectId = await insertNewsEffect(gameId, newsId, TYPHOON_ROUNDS);
            retVal = checkTyphoonHit(gameId, newsId, newsEffectId);
            return retVal;
        case 'Tsunami!':
            newsEffectId = await insertNewsEffect(gameId, newsId, TYPHOON_ROUNDS);
            // retVal = checkTyphoonHit(gameId, newsId, newsEffectId);
            return retVal;
        case 'April Showers Bring... Terror?':
            newsEffectId = await insertNewsEffect(gameId, newsId, TYPHOON_ROUNDS);
            // loseSixPoints(gameId);
            return retVal;
        case 'Who Put Coke in the JP-8?':
            // No taking off, landing, or refueling
            return retVal;
        case 'Contanminated Water!':
            return retVal;
        case '"Have You Seen My Wrench?"':
            // Disable all helicopters for one team // one turn
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

// need to call for each round not just at the beginning of each turn
export const decreaseNewsEffect = async (gameId: GameType['gameId']) => {
    const queryString = 'UPDATE newsEffects SET roundsLeft = roundsLeft - 1 WHERE newsEffectGameId = ?';
    const inserts = [gameId];
    await pool.query(queryString, inserts);
    await pool.query('DELETE FROM newsEffects WHERE roundsLeft = 0');
};
