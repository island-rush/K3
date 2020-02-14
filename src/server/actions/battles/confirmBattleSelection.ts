// prettier-ignore
import { BATTLE_FIGHT_RESULTS, BLUE_TEAM_ID, COMBAT_PHASE_ID, GAME_DOES_NOT_EXIST, GAME_INACTIVE_TAG, NOT_WAITING_STATUS, RED_TEAM_ID, TYPE_MAIN, UPDATE_AIRFIELDS, UPDATE_FLAGS, WAITING_STATUS } from '../../../constants';
// prettier-ignore
import { BattleResultsAction, ConfirmBattleSelectionRequestAction, SocketSession, UpdateAirfieldAction, UpdateFlagAction } from '../../../types';
import { Battle, Game } from '../../classes';
import { redirectClient, sendToGame, sendUserFeedback } from '../../helpers';
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

    if (thisTeamStatus === WAITING_STATUS && otherTeamStatus === NOT_WAITING_STATUS) {
        sendUserFeedback(socketId, 'still waiting stupid...');
        return;
    }

    // confirm the selections
    const thisBattle = await Battle.getNext(gameId);
    await thisBattle.bulkUpdateTargets(friendlyPieces);

    // are we waiting for the other client?
    // and if thisTeamStatus == NOT_WAITING....(maybe make explicit here <-TODO:
    if (otherTeamStatus === NOT_WAITING_STATUS) {
        await thisGame.setStatus(gameTeam, WAITING_STATUS);
        sendUserFeedback(socketId, 'confirmed, now waiting on other team...');
        return;
    }

    // if get here, other team was already waiting, need to set them to 0 and handle stuff
    await thisGame.setStatus(otherTeam, NOT_WAITING_STATUS);

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
