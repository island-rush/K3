import { RowDataPacket } from 'mysql2/promise';
import { Battle, InvItem, Piece, Plan } from '..';
// prettier-ignore
import { BLUE_TEAM_ID, NEWS_PHASE_ID } from '../../../constants';
import { BlueOrRedTeamId, ControllerType, GameInitialStateAction, INITIAL_GAMESTATE, NewsType } from '../../../types';
import { pool } from '../../database';
import { Capability } from '../Capability';
import { ShopItem } from '../ShopItem';
import { Game } from './Game';

export const initialStateAction = async (game: Game, gameTeam: BlueOrRedTeamId, gameControllers: ControllerType[]) => {
    const serverAction: GameInitialStateAction = {
        type: INITIAL_GAMESTATE,
        payload: {
            gameboardPieces: await Piece.getVisiblePieces(game.gameId, gameTeam),
            invItems: await InvItem.all(game.gameId, gameTeam),
            shopItems: await ShopItem.all(game.gameId, gameTeam),
            planning: {
                confirmedPlans: await Plan.getConfirmedPlans(game.gameId, gameTeam)
            },
            capabilities: {
                confirmedRods: await Capability.getRodsFromGod(game.gameId, gameTeam),
                confirmedRemoteSense: await Capability.getRemoteSensing(game.gameId, gameTeam),
                confirmedInsurgency: await Capability.getInsurgency(game.gameId, gameTeam),
                confirmedBioWeapons: await Capability.getBiologicalWeapons(game.gameId, gameTeam),
                confirmedRaiseMorale: await Capability.getRaiseMorale(game.gameId, gameTeam),
                confirmedCommInterrupt: await Capability.getCommInterrupt(game.gameId, gameTeam),
                confirmedGoldenEye: await Capability.getGoldenEye(game.gameId, gameTeam),
                confirmedSeaMines: await Capability.getSeaMines(game.gameId, gameTeam),
                seaMineHits: [],
                confirmedDroneSwarms: await Capability.getDroneSwarms(game.gameId, gameTeam),
                droneSwarmHits: [],
                confirmedAtcScramble: await Capability.getAtcScramble(game.gameId, gameTeam),
                confirmedNukes: await Capability.getNukes(game.gameId, gameTeam),
                confirmedMissileAttacks: await Capability.getMissileAttack(game.gameId, gameTeam),
                confirmedMissileHitPos: [],
                confirmedBombardments: await Capability.getBombardmentAttack(game.gameId, gameTeam),
                confirmedBombardmentHitPos: [],
                confirmedAntiSat: await Capability.getAntiSat(game.gameId, gameTeam),
                confirmedAntiSatHitPos: [],
                confirmedMissileDisrupts: await Capability.getMissileDisrupt(game.gameId, gameTeam),
                isCyberDefenseActive: await Capability.getCyberDefense(game.gameId, gameTeam),
                samHitPos: []
            },
            gameInfo: {
                gameSection: game.gameSection,
                gameInstructor: game.gameInstructor,
                gameTeam,
                gameControllers,
                gamePhase: game.gamePhase,
                gameRound: game.gameRound,
                gameSlice: game.gameSlice,
                gameStatus: game.getStatus(gameTeam),
                gamePoints: game.getPoints(gameTeam),
                flag0: game.flag0,
                flag1: game.flag1,
                flag2: game.flag2,
                flag3: game.flag3,
                flag4: game.flag4,
                flag5: game.flag5,
                flag6: game.flag6,
                flag7: game.flag7,
                flag8: game.flag8,
                flag9: game.flag9,
                flag10: game.flag10,
                flag11: game.flag11,
                flag12: game.flag12,
                airfield0: game.airfield0,
                airfield1: game.airfield1,
                airfield2: game.airfield2,
                airfield3: game.airfield3,
                airfield4: game.airfield4,
                airfield5: game.airfield5,
                airfield6: game.airfield6,
                airfield7: game.airfield7,
                airfield8: game.airfield8,
                airfield9: game.airfield9
            }
        }
    };

    if (game.gamePhase === NEWS_PHASE_ID) {
        const queryString = 'SELECT * FROM news WHERE newsGameId = ? ORDER BY newsOrder ASC LIMIT 1';
        const inserts = [game.gameId];
        const [resultNews] = await pool.query<RowDataPacket[] & NewsType[]>(queryString, inserts);

        serverAction.payload.news = {
            newsTitle: resultNews[0] !== undefined ? resultNews[0].newsTitle : 'No More News',
            newsInfo: resultNews[0] !== undefined ? resultNews[0].newsInfo : 'Click to continue'
        };
    }

    const battle = await Battle.getNext(game.gameId);
    if (battle) {
        const {
            blueFriendlyBattlePieces,
            redFriendlyBattlePieces,
            blueFriendlyBattlePiecesNoTargets,
            redFriendlyBattlePiecesNoTargets
        } = await battle.getBattleState();

        serverAction.payload.battle = {
            friendlyPieces: gameTeam === BLUE_TEAM_ID ? blueFriendlyBattlePieces : redFriendlyBattlePieces,
            enemyPieces: gameTeam === BLUE_TEAM_ID ? redFriendlyBattlePiecesNoTargets : blueFriendlyBattlePiecesNoTargets
        };
    }

    return serverAction;
};
