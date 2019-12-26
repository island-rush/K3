import { Socket } from 'socket.io';
import { AIR_REFUELING_SQUADRON_ID, BLUE_TEAM_ID, RED_TEAM_ID, SOCKET_SERVER_SENDING_ACTION } from '../../constants';
import { GameType } from '../../types';
import { EventBattleAction, EventRefuelAction, NoMoreEventsAction } from '../../react-client/src/interfaces/interfaces';
import { EVENT_BATTLE, EVENT_REFUEL, NO_MORE_EVENTS } from '../../react-client/src/redux/actions/actionTypes';
import { GameSession } from '../../types/sessionTypes';
import { Event, Piece } from '../classes';
import { COL_BATTLE_EVENT_TYPE, POS_BATTLE_EVENT_TYPE, REFUEL_EVENT_TYPE } from './eventConstants';
import { sendUserFeedback } from './sendUserFeedback';

/**
 * Find the next event in the EventQueue and send to this team (through a socket)
 */
const giveNextEvent = async (socket: Socket, options: GiveNextEventOptions) => {
    // Grab Session
    const session: GameSession = socket.handshake.session.ir3;

    // prettier-ignore
    const { thisGame: { gameId }, gameTeam } = options;

    const otherTeam = gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;

    const gameEvent = await Event.getNext(gameId, gameTeam);

    if (!gameEvent) {
        const noMoreEventsAction: NoMoreEventsAction = {
            type: NO_MORE_EVENTS,
            payload: {
                gameboardPieces: options.executingStep ? await Piece.getVisiblePieces(gameId, gameTeam) : null,
                gameStatus: options.executingStep ? 0 : null
            }
        };

        socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, noMoreEventsAction);
        if (session.gameTeam === gameTeam) socket.emit(SOCKET_SERVER_SENDING_ACTION, noMoreEventsAction);

        return;
    }

    switch (gameEvent.eventTypeId) {
        case COL_BATTLE_EVENT_TYPE:
        case POS_BATTLE_EVENT_TYPE:
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
                    gameboardPieces: options.executingStep ? await Piece.getVisiblePieces(gameId, gameTeam) : null,
                    gameStatus: options.executingStep ? 0 : null
                }
            };

            socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, eventBattleAction);
            if (session.gameTeam === gameTeam) socket.emit(SOCKET_SERVER_SENDING_ACTION, eventBattleAction);

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
                    gameboardPieces: options.executingStep ? await Piece.getVisiblePieces(gameId, gameTeam) : null,
                    gameStatus: options.executingStep ? 0 : null
                }
            };

            socket.to(`game${gameId}team${gameTeam}`).emit(SOCKET_SERVER_SENDING_ACTION, eventRefuelAction);
            if (session.gameTeam === gameTeam) socket.emit(SOCKET_SERVER_SENDING_ACTION, eventRefuelAction);

            return;
        default:
            sendUserFeedback(socket, 'Server Error, unknown event type...');
    }
};

type GiveNextEventOptions = {
    thisGame: GameType;
    gameTeam: number;
    executingStep?: boolean;
};

export default giveNextEvent;
