// prettier-ignore
import { BLUE_TEAM_ID, COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, RED_TEAM_ID, TYPE_MAIN, WAITING_STATUS } from '../../../constants';
// prettier-ignore
import { BattleResultsAction, BattleSelectionsAction, BattleState, BATTLE_FIGHT_RESULTS, BATTLE_SELECTIONS, ConfirmBattleSelectionRequestAction, PieceType, SocketSession, UpdateAirfieldAction, UpdateFlagAction, UPDATE_AIRFIELDS, UPDATE_FLAGS } from '../../../types';
import { Battle, Game } from '../../classes';
import { redirectClient, sendToGame, sendToTeam, sendUserFeedback } from '../../helpers';
import { giveNextBattle } from './giveNextBattle';

/**
 * User request to confirm their battle selections. (what pieces are attacking what other pieces)
 */
export const confirmBattleSelection = async (session: SocketSession, action: ConfirmBattleSelectionRequestAction) => {
    // Grab the Session
    const { ir3, socketId } = session;
    const { gameId, gameTeam, gameControllers } = ir3;

    const { friendlyPieces } = action.payload;

    // Get the Game
    const thisGame = await new Game(gameId).init();
    if (!thisGame) {
        redirectClient(socketId, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameBlueStatus, gameRedStatus } = thisGame;

    if (!gameActive) {
        redirectClient(socketId, GAME_INACTIVE_TAG);
        return;
    }

    if (gamePhase !== COMBAT_PHASE_ID) {
        sendUserFeedback(socketId, 'Not the right phase for battle selections.');
        return;
    }

    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socketId, 'Need to be main commander.');
        return;
    }

    const otherTeam = gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID;
    const thisTeamStatus = gameTeam === BLUE_TEAM_ID ? gameBlueStatus : gameRedStatus;
    const otherTeamStatus = otherTeam === BLUE_TEAM_ID ? gameBlueStatus : gameRedStatus;

    // TODO: perhaps a better way of checking if they already submitted plans, status checks seem buggy (although bugs for status seem very rare, refreshing fixed whatever was wrong)
    if (thisTeamStatus === WAITING_STATUS && otherTeamStatus === NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'still waiting stupid...');
        return;
    }

    // confirm the selections
    const thisBattle = await Battle.getNext(gameId);
    await thisBattle.bulkUpdateTargets(friendlyPieces);

    // non-main controllers need to get the battle selections before the results
    // TODO: this logic is repeated in initialStateAction (can clean up a lot of this eventually)
    const friendlyPiecesList: any = await thisBattle.getTeamItems(gameTeam === BLUE_TEAM_ID ? BLUE_TEAM_ID : RED_TEAM_ID);
    const enemyPiecesList: any = await thisBattle.getTeamItems(gameTeam === BLUE_TEAM_ID ? RED_TEAM_ID : BLUE_TEAM_ID);
    const newFriendlyPieces: { piece: PieceType; targetPiece: PieceType; targetPieceIndex?: number }[] = [];
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
        newFriendlyPieces.push(thisFriendlyPiece);
    }
    for (let y = 0; y < enemyPiecesList.length; y++) {
        enemyPieces.push({
            targetPiece: null,
            targetPieceIndex: -1,
            piece: enemyPiecesList[y]
        });
    }

    // now need to get the targetPieceIndex from the thing....if needed....
    for (let z = 0; z < newFriendlyPieces.length; z++) {
        if (friendlyPieces[z].targetPiece != null) {
            const { pieceId } = friendlyPieces[z].targetPiece;

            friendlyPieces[z].targetPieceIndex = enemyPieces.findIndex(enemyPieceThing => enemyPieceThing.piece.pieceId === pieceId);
        }
    }

    const battleSelectionsAction: BattleSelectionsAction = {
        type: BATTLE_SELECTIONS,
        payload: {
            friendlyPieces,
            enemyPieces
        }
    };
    // TODO: we send the confirmed selections to all teams, then immediately send battle results if last to confirm....could cause errors if network delays cause results to come before confirmedSelections
    // to prevent weird (but unlikely) errors, need to either delay it (bad fix), or somehow send the confirmed selections along with the results (should probably do that anyways? -> replace the state entirely?)
    sendToTeam(gameId, gameTeam, battleSelectionsAction); // doesn't change anything for the main commander that just sent this

    // are we waiting for the other client?
    // and if thisTeamStatus == NOT_WAITING....(maybe make explicit here <-TODO:
    if (otherTeamStatus === NOT_WAITING_STATUS) {
        await thisGame.setStatus(gameTeam, WAITING_STATUS);
        sendUserFeedback(socketId, 'confirmed, now waiting on other team...');
        return;
    }

    // if get here, other team was already waiting and we were not waiting, need to set them to 0 and handle stuff
    await thisGame.setStatus(otherTeam, NOT_WAITING_STATUS);

    // Wait to let battle selections go to all controllers on the team, then send the results (which right now depend on frontend already having selections?)
    await new Promise(resolve => setTimeout(resolve, 50)); // TODO: get rid of this crap by refactoring above code to only send BATTLE_SELECTIONS action if waiting....timing is weird here so think it though

    // Do the fight!
    const fightResults = await thisBattle.fight();

    // Send the results of the battle back to the client(s)
    if (fightResults.atLeastOneBattle) {
        const serverAction: BattleResultsAction = {
            type: BATTLE_FIGHT_RESULTS,
            payload: {
                masterRecord: fightResults.masterRecord
            }
        };

        sendToGame(gameId, serverAction);
        return;
    }

    await thisBattle.delete();

    // Check for flag updates after the battle (enemy may no longer be there = capture the flag)
    const didUpdateFlags = await thisGame.updateFlags();
    if (didUpdateFlags) {
        const updateFlagAction: UpdateFlagAction = {
            type: UPDATE_FLAGS,
            payload: {
                flag0: thisGame.flag0,
                flag1: thisGame.flag1,
                flag2: thisGame.flag2,
                flag3: thisGame.flag3,
                flag4: thisGame.flag4,
                flag5: thisGame.flag5,
                flag6: thisGame.flag6,
                flag7: thisGame.flag7,
                flag8: thisGame.flag8,
                flag9: thisGame.flag9,
                flag10: thisGame.flag10,
                flag11: thisGame.flag11,
                flag12: thisGame.flag12
            }
        };

        sendToGame(gameId, updateFlagAction);
    }

    // TODO: combine with flag update for less requests

    const didUpdateAirfields = await thisGame.updateAirfields();
    if (didUpdateAirfields) {
        const updateAirfieldAction: UpdateAirfieldAction = {
            type: UPDATE_AIRFIELDS,
            payload: {
                airfield0: thisGame.airfield0,
                airfield1: thisGame.airfield1,
                airfield2: thisGame.airfield2,
                airfield3: thisGame.airfield3,
                airfield4: thisGame.airfield4,
                airfield5: thisGame.airfield5,
                airfield6: thisGame.airfield6,
                airfield7: thisGame.airfield7,
                airfield8: thisGame.airfield8,
                airfield9: thisGame.airfield9
            }
        };

        // Send all airfield updates to every team
        sendToGame(gameId, updateAirfieldAction);
    }

    await giveNextBattle(thisGame);
};
