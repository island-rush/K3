import { BlueOrRedTeamId, GameType, RemoteSensingType } from '../../../types';
import { Game } from '../Game';
import { Piece } from '../Piece';
import { checkAntiSatHit, checkRemoteSensingHit, decreaseAntiSat, getAntiSat, insertAntiSat } from './antiSat';
import { decreaseAtcScramble, getAtcScramble, insertAtcScramble, useAtcScramble } from './atcScramble';
import { decreaseBiologicalWeapons, getBiologicalWeapons, insertBiologicalWeapons, useBiologicalWeapons } from './biologicalWeapons';
import { getBombardmentAttack, insertBombardmentAttack, useBombardmentAttack } from './bombardment';
import { decreaseCommInterrupt, getCommInterrupt, insertCommInterrupt, useCommInterrupt } from './commInterrupt';
import { decreaseCyberDefense, getCyberDefense, insertCyberDefense, useCyberDefense } from './cyberDefense';
import { checkDroneSwarmHit, decreaseDroneSwarms, getDroneSwarms, insertDroneSwarm } from './droneSwarms';
import { decreaseGoldenEye, getGoldenEye, insertGoldenEye, useGoldenEye } from './goldenEye';
import { getInsurgency, insurgencyInsert, useInsurgency } from './insurgency';
import { getMissileAttack, insertMissileAttack, useMissileAttack } from './missileAttack';
import { decreaseMissileDisrupt, getMissileDisrupt, insertMissileDisrupt, useMissileDisrupt } from './missileDisrupt';
import { getNukes, insertNuke, useNukes } from './nuclearStrike';
import { decreaseRaiseMorale, getRaiseMorale, insertRaiseMorale } from './raiseMorale';
import { decreaseRemoteSensing, getRemoteSensing, remoteSensingInsert } from './remoteSensing';
import { getRodsFromGod, rodsFromGodInsert, useRodsFromGod } from './rodsFromGod';
import { checkSeaMineHit, getSeaMines, insertSeaMine } from './seaMines';
import { sofTakeoutAirfieldsAndSilos } from './sofTeam';

/**
 * List of static functions for handling capabilities. (Groups all functions inside a single static class)
 */
export class Capability {
    static async sofTakeoutAirfieldsAndSilos(game: Game) {
        // need the entire game, and not just gameId, to check airfield ownerships
        return sofTakeoutAirfieldsAndSilos(game);
    }

    static async useCyberDefense(gameId: GameType['gameId']) {
        return useCyberDefense(gameId);
    }

    static async decreaseCyberDefense(gameId: GameType['gameId']) {
        return decreaseCyberDefense(gameId);
    }

    static async getCyberDefense(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getCyberDefense(gameId, gameTeam);
    }

    static async insertCyberDefense(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return insertCyberDefense(gameId, gameTeam);
    }

    static async insertMissileDisrupt(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPiece: Piece) {
        return insertMissileDisrupt(gameId, gameTeam, selectedPiece);
    }

    static async getMissileDisrupt(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getMissileDisrupt(gameId, gameTeam);
    }

    static async decreaseMissileDisrupt(gameId: GameType['gameId']) {
        return decreaseMissileDisrupt(gameId);
    }

    static async useMissileDisrupt(gameId: GameType['gameId']) {
        return useMissileDisrupt(gameId);
    }

    static async insertAntiSat(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return insertAntiSat(gameId, gameTeam);
    }

    static async decreaseAntiSat(gameId: GameType['gameId']) {
        return decreaseAntiSat(gameId);
    }

    static async getAntiSat(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getAntiSat(gameId, gameTeam);
    }

    static async checkAntiSatHit(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, antiSatId: number) {
        return checkAntiSatHit(gameId, gameTeam, antiSatId);
    }

    static async checkRemoteSensingHit(
        gameId: GameType['gameId'],
        gameTeam: BlueOrRedTeamId,
        remoteSensingId: RemoteSensingType['remoteSensingId'],
        remoteSensingPosId: number
    ) {
        return checkRemoteSensingHit(gameId, gameTeam, remoteSensingId, remoteSensingPosId);
    }

    static async insertBombardmentAttack(gameId: GameType['gameId'], destroyerPiece: Piece, targetPiece: Piece) {
        return insertBombardmentAttack(gameId, destroyerPiece, targetPiece);
    }

    static async getBombardmentAttack(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getBombardmentAttack(gameId, gameTeam);
    }

    static async useBombardmentattack(gameId: GameType['gameId']) {
        return useBombardmentAttack(gameId);
    }

    // TODO: could pass around the Piece class directly instead of the PieceType (since i think methods would still work...and it's probably what we're sending anyway)
    static async insertMissileAttack(gameId: GameType['gameId'], missilePiece: Piece, targetPiece: Piece) {
        return insertMissileAttack(gameId, missilePiece, targetPiece);
    }

    static async getMissileAttack(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getMissileAttack(gameId, gameTeam); // TODO: could be consistent with 'gameTeam' vs 'teamId' -> even in the database
    }

    static async useMissileAttack(gameId: GameType['gameId']) {
        return useMissileAttack(gameId);
    }

    static async getNukes(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getNukes(gameId, gameTeam);
    }

    static async insertNuke(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return insertNuke(gameId, gameTeam, selectedPositionId);
    }

    static async useNukes(gameId: GameType['gameId']) {
        return useNukes(gameId);
    }

    static async rodsFromGodInsert(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return rodsFromGodInsert(gameId, gameTeam, selectedPositionId);
    }

    static async getRodsFromGod(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getRodsFromGod(gameId, gameTeam);
    }

    static async useRodsFromGod(gameId: GameType['gameId']) {
        return useRodsFromGod(gameId);
    }

    static async insurgencyInsert(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return insurgencyInsert(gameId, gameTeam, selectedPositionId);
    }

    static async getInsurgency(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getInsurgency(gameId, gameTeam);
    }

    static async useInsurgency(gameId: GameType['gameId']) {
        return useInsurgency(gameId);
    }

    static async remoteSensingInsert(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return remoteSensingInsert(gameId, gameTeam, selectedPositionId);
    }

    static async getRemoteSensing(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getRemoteSensing(gameId, gameTeam);
    }

    static async decreaseRemoteSensing(gameId: GameType['gameId']) {
        return decreaseRemoteSensing(gameId);
    }

    static async insertBiologicalWeapons(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return insertBiologicalWeapons(gameId, gameTeam, selectedPositionId);
    }

    static async getBiologicalWeapons(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getBiologicalWeapons(gameId, gameTeam);
    }

    static async useBiologicalWeapons(gameId: GameType['gameId']) {
        return useBiologicalWeapons(gameId);
    }

    static async decreaseBiologicalWeapons(gameId: GameType['gameId']) {
        return decreaseBiologicalWeapons(gameId);
    }

    static async insertRaiseMorale(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedCommanderType: number) {
        return insertRaiseMorale(gameId, gameTeam, selectedCommanderType);
    }

    static async decreaseRaiseMorale(gameId: GameType['gameId']) {
        return decreaseRaiseMorale(gameId);
    }

    static async getRaiseMorale(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getRaiseMorale(gameId, gameTeam);
    }

    static async insertCommInterrupt(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return insertCommInterrupt(gameId, gameTeam, selectedPositionId);
    }

    static async getCommInterrupt(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getCommInterrupt(gameId, gameTeam);
    }

    static async useCommInterrupt(gameId: GameType['gameId']) {
        return useCommInterrupt(gameId);
    }

    static async decreaseCommInterrupt(gameId: GameType['gameId']) {
        return decreaseCommInterrupt(gameId);
    }

    static async getGoldenEye(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getGoldenEye(gameId, gameTeam);
    }

    static async insertGoldenEye(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return insertGoldenEye(gameId, gameTeam, selectedPositionId);
    }

    static async useGoldenEye(gameId: GameType['gameId']) {
        return useGoldenEye(gameId);
    }

    static async decreaseGoldenEye(gameId: GameType['gameId']) {
        return decreaseGoldenEye(gameId);
    }

    static async insertSeaMine(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return insertSeaMine(gameId, gameTeam, selectedPositionId);
    }

    static async getSeaMines(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getSeaMines(gameId, gameTeam);
    }

    static async checkSeaMineHit(gameId: GameType['gameId']) {
        return checkSeaMineHit(gameId);
    }

    static async getDroneSwarms(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getDroneSwarms(gameId, gameTeam);
    }

    static async insertDroneSwarm(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return insertDroneSwarm(gameId, gameTeam, selectedPositionId);
    }

    static async checkDroneSwarmHit(gameId: GameType['gameId']) {
        return checkDroneSwarmHit(gameId);
    }

    static async decreaseDroneSwarms(gameId: GameType['gameId']) {
        return decreaseDroneSwarms(gameId);
    }

    static async getAtcScramble(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId) {
        return getAtcScramble(gameId, gameTeam);
    }

    static async insertAtcScramble(gameId: GameType['gameId'], gameTeam: BlueOrRedTeamId, selectedPositionId: number) {
        return insertAtcScramble(gameId, gameTeam, selectedPositionId);
    }

    static async decreaseAtcScramble(gameId: GameType['gameId']) {
        return decreaseAtcScramble(gameId);
    }

    static async useAtcScramble(gameId: GameType['gameId']) {
        return useAtcScramble(gameId);
    }
}
