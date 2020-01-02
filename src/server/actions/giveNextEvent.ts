import { Socket } from 'socket.io';
// prettier-ignore
import { AIR_REFUELING_SQUADRON_ID, BLUE_TEAM_ID, COL_BATTLE_EVENT_TYPE, EVENT_BATTLE, EVENT_REFUEL, NOT_WAITING_STATUS, NO_MORE_EVENTS, POS_BATTLE_EVENT_TYPE, RED_TEAM_ID, REFUEL_EVENT_TYPE, SOCKET_SERVER_SENDING_ACTION } from '../../constants';
import { EventBattleAction, EventRefuelAction, GameSession, NoMoreEventsAction } from '../../types';
import { Event, Game, Piece } from '../classes';
import { sendToThisTeam, sendUserFeedback } from '../helpers';

/**
 * Find the next event in the EventQueue and send to this team (through a socket)
 */
export const giveNextEvent = async (socket: Socket, options: GiveNextEventOptions) => {
    // Grab Session
    const session = socket.handshake.session.ir3 as GameSession;

    // prettier-ignore
    const { thisGame: { gameId }, gameTeam } = options;

    const otherTeam = gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

    const gameEvent = await Event.getNext(gameId, gameTeam);

    if (!gameEvent) {
        const noMoreEventsAction: NoMoreEventsAction = {
            type: NO_MORE_EVENTS,
            payload: {
                gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
                gameStatus: 0
            }
        };

        socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, noMoreEventsAction);
        if (session.gameTeam === gameTeam) socket.emit(SOCKET_SERVER_SENDING_ACTION, noMoreEventsAction);

        return;
    }

    switch (gameEvent.eventTypeId) {
        case COL_BATTLE_EVENT_TYPE:
        case POS_BATTLE_EVENT_TYPE:
            await options.thisGame.setStatus(gameTeam, NOT_WAITING_STATUS);

            const friendlyPiecesList: any = await gameEvent.getTeamItems(gameTeam);
            const enemyPiecesList: any = await gameEvent.getTeamItems(otherTeam);
            const friendlyPieces: any = [];
            const enemyPieces: any = [];

            // Format for the client
            for (let x = 0; x < friendlyPiecesList.length; x++) {
                const thisFriendlyPiece: any = {
                    targetPiece: null,
                    targetPieceIndex: -1
                };
                thisFriendlyPiece.piece = friendlyPiecesList[x];
                friendlyPieces.push(thisFriendlyPiece);
            }

            for (let y = 0; y < enemyPiecesList.length; y++) {
                const thisEnemyPiece: any = {
                    targetPiece: null,
                    targetPieceIndex: -1
                };
                thisEnemyPiece.piece = enemyPiecesList[y];
                enemyPieces.push(thisEnemyPiece);
            }

            const eventBattleAction: EventBattleAction = {
                type: EVENT_BATTLE,
                payload: {
                    friendlyPieces,
                    enemyPieces,
                    gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
                    gameStatus: 0
                }
            };

            sendToThisTeam(socket, eventBattleAction);
            return;
        case REFUEL_EVENT_TYPE:
            // get the pieces from the event, put them into payload (pre-format based on state?)
            // Format for the client
            const allRefuelEventItems: any = await gameEvent.getRefuelItems();

            const tankers = [];
            const aircraft = [];
            for (let x = 0; x < allRefuelEventItems.length; x++) {
                // put each piece into the refuel event....
                const thisPiece = allRefuelEventItems[x];
                const { pieceTypeId } = thisPiece;
                if (pieceTypeId === AIR_REFUELING_SQUADRON_ID) {
                    tankers.push(thisPiece);
                } else {
                    aircraft.push(thisPiece);
                }
            }

            const eventRefuelAction: EventRefuelAction = {
                type: EVENT_REFUEL,
                payload: {
                    tankers,
                    aircraft,
                    gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
                    gameStatus: 0
                }
            };

            sendToThisTeam(socket, eventRefuelAction);
            return;
        default:
            sendUserFeedback(socket, 'Server Error, unknown event type...');
    }
};

type GiveNextEventOptions = {
    thisGame: Game;
    gameTeam: number;
};
