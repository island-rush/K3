import { RowDataPacket } from 'mysql2/promise';
import { Event, InvItem, Piece, Plan } from '..';
// prettier-ignore
import { AIR_REFUELING_SQUADRON_ID, BLUE_TEAM_ID, COL_BATTLE_EVENT_TYPE, INITIAL_GAMESTATE, NEWS_PHASE_ID, POS_BATTLE_EVENT_TYPE, RED_TEAM_ID, REFUEL_EVENT_TYPE } from '../../../constants';
import { BattleState, GameInitialStateAction, NewsType, PieceType, RefuelState, BlueOrRedTeamId, ControllerType } from '../../../types';
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

    // TODO: get these values from the database (potentially throw game into the event object)
    // TODO: current event could be a refuel (or something else...need to handle all of them, and set other states as false...)
    // TODO: don't have to check if not in the combat phase...(prevent these checks for added efficiency?)
    const currentEvent = await Event.getNext(game.gameId, gameTeam);

    if (currentEvent) {
        const { eventTypeId } = currentEvent;
        switch (eventTypeId) {
            case POS_BATTLE_EVENT_TYPE:
            case COL_BATTLE_EVENT_TYPE:
                const friendlyPiecesList: any = await currentEvent.getTeamItems(gameTeam === BLUE_TEAM_ID ? BLUE_TEAM_ID : RED_TEAM_ID);
                const enemyPiecesList: any = await currentEvent.getTeamItems(gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID);
                const friendlyPieces: { piece: PieceType; targetPiece: PieceType; targetPieceIndex?: number }[] = [];
                const enemyPieces: {
                    targetPiece: any | null;
                    targetPieceIndex: number;
                    piece: any;
                }[] = [];

                // formatting for the frontend
                for (let x = 0; x < friendlyPiecesList.length; x++) {
                    // need to transform pieces and stuff...
                    const thisFriendlyPiece: BattleState['friendlyPieces'][0] = {
                        // TODO: is this type annotation correct for 'index of this array type'?
                        piece: {
                            pieceId: friendlyPiecesList[x].pieceId,
                            pieceGameId: friendlyPiecesList[x].pieceGameId,
                            pieceTeamId: friendlyPiecesList[x].pieceTeamId,
                            pieceTypeId: friendlyPiecesList[x].pieceTypeId,
                            piecePositionId: friendlyPiecesList[x].piecePositionId,
                            pieceVisible: friendlyPiecesList[x].pieceVisible,
                            pieceMoves: friendlyPiecesList[x].pieceMoves,
                            pieceFuel: friendlyPiecesList[x].pieceFuel,
                            pieceContainerId: -1 // TODO: don't force these values to fit type, actually get them and put them here
                        },
                        targetPiece:
                            friendlyPiecesList[x].tpieceId == null
                                ? null
                                : {
                                      pieceId: friendlyPiecesList[x].tpieceId,
                                      pieceGameId: friendlyPiecesList[x].tpieceGameId,
                                      pieceTeamId: friendlyPiecesList[x].tpieceTeamId,
                                      pieceTypeId: friendlyPiecesList[x].tpieceTypeId,
                                      piecePositionId: friendlyPiecesList[x].tpiecePositionId,
                                      pieceVisible: friendlyPiecesList[x].tpieceVisible,
                                      pieceMoves: friendlyPiecesList[x].tpieceMoves,
                                      pieceFuel: friendlyPiecesList[x].tpieceFuel,
                                      pieceContainerId: -1 // TODO: don't force these (same as above)
                                  }
                    };
                    friendlyPieces.push(thisFriendlyPiece);
                }
                for (let y = 0; y < enemyPiecesList.length; y++) {
                    enemyPieces.push({
                        targetPiece: null,
                        targetPieceIndex: -1,
                        piece: enemyPiecesList[y]
                    });
                }

                // now need to get the targetPieceIndex from the thing....if needed....
                for (let z = 0; z < friendlyPieces.length; z++) {
                    if (friendlyPieces[z].targetPiece != null) {
                        const { pieceId } = friendlyPieces[z].targetPiece;

                        friendlyPieces[z].targetPieceIndex = enemyPieces.findIndex(enemyPieceThing => enemyPieceThing.piece.pieceId === pieceId);
                    }
                }

                serverAction.payload.battle = {
                    friendlyPieces,
                    enemyPieces
                };
                break;
            case REFUEL_EVENT_TYPE:
                // need to get tankers and aircraft and put that into the payload...
                const tankers: RefuelState['tankers'] = [];
                const aircraft: RefuelState['aircraft'] = [];
                const allRefuelItems = await currentEvent.getRefuelItems();

                for (let x = 0; x < allRefuelItems.length; x++) {
                    const thisRefuelItem = allRefuelItems[x];
                    const { pieceTypeId } = thisRefuelItem;
                    if (pieceTypeId === AIR_REFUELING_SQUADRON_ID) {
                        tankers.push(thisRefuelItem);
                    } else {
                        aircraft.push(thisRefuelItem);
                    }
                }

                serverAction.payload.refuel = {
                    tankers,
                    aircraft
                };
                break;
            default:
            // do nothing, unknown event type...should do something...
        }
    }

    return serverAction;
};
