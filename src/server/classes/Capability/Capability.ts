import { PieceType } from '../../../types';
import { Piece } from '../Piece';
import { decreaseAtcScramble, getAtcScramble, insertAtcScramble, useAtcScramble } from './atcScramble';
import { decreaseBiologicalWeapons, getBiologicalWeapons, insertBiologicalWeapons, useBiologicalWeapons } from './biologicalWeapons';
import { getBombardmentAttack, insertBombardmentAttack, useBombardmentAttack } from './bombardment';
import { decreaseCommInterrupt, getCommInterrupt, insertCommInterrupt, useCommInterrupt } from './commInterrupt';
import { checkDroneSwarmHit, decreaseDroneSwarms, getDroneSwarms, insertDroneSwarm } from './droneSwarms';
import { decreaseGoldenEye, getGoldenEye, insertGoldenEye, useGoldenEye } from './goldenEye';
import { getInsurgency, insurgencyInsert, useInsurgency } from './insurgency';
import { getMissileAttack, insertMissileAttack, useMissileAttack } from './missileAttack';
import { getNukes, insertNuke, useNukes } from './nuclearStrike';
import { decreaseRaiseMorale, getRaiseMorale, insertRaiseMorale } from './raiseMorale';
import { decreaseRemoteSensing, getRemoteSensing, remoteSensingInsert } from './remoteSensing';
import { getRodsFromGod, rodsFromGodInsert, useRodsFromGod } from './rodsFromGod';
import { checkSeaMineHit, getSeaMines, insertSeaMine } from './seaMines';

/**
 * List of static functions for handling capabilities. (Groups all functions inside a single static class)
 */
export class Capability {
    static async insertBombardmentAttack(gameId: number, destroyerPiece: PieceType, targetPiece: PieceType) {
        return insertBombardmentAttack(gameId, destroyerPiece, targetPiece);
    }

    static async getBombardmentAttack(gameId: number, gameTeam: number) {
        return getBombardmentAttack(gameId, gameTeam);
    }

    static async useBombardmentattack(gameId: number) {
        return useBombardmentAttack(gameId);
    }

    static async insertMissileAttack(gameId: number, missilePiece: Piece, targetPiece: PieceType) {
        return insertMissileAttack(gameId, missilePiece, targetPiece);
    }

    static async getMissileAttack(gameId: number, gameTeam: number) {
        return getMissileAttack(gameId, gameTeam); // TODO: could be consistent with 'gameTeam' vs 'teamId' -> even in the database
    }

    static async useMissileAttack(gameId: number) {
        return useMissileAttack(gameId);
    }

    static async getNukes(gameId: number, gameTeam: number) {
        return getNukes(gameId, gameTeam);
    }

    static async insertNuke(gameId: number, gameTeam: number, selectedPositionId: number) {
        return insertNuke(gameId, gameTeam, selectedPositionId);
    }

    static async useNukes(gameId: number) {
        return useNukes(gameId);
    }

    static async rodsFromGodInsert(gameId: number, gameTeam: number, selectedPositionId: number) {
        return rodsFromGodInsert(gameId, gameTeam, selectedPositionId);
    }

    static async getRodsFromGod(gameId: number, gameTeam: number) {
        return getRodsFromGod(gameId, gameTeam);
    }

    static async useRodsFromGod(gameId: number) {
        return useRodsFromGod(gameId);
    }

    static async insurgencyInsert(gameId: number, gameTeam: number, selectedPositionId: number) {
        return insurgencyInsert(gameId, gameTeam, selectedPositionId);
    }

    static async getInsurgency(gameId: number, gameTeam: number) {
        return getInsurgency(gameId, gameTeam);
    }

    static async useInsurgency(gameId: number) {
        return useInsurgency(gameId);
    }

    static async remoteSensingInsert(gameId: number, gameTeam: number, selectedPositionId: number) {
        return remoteSensingInsert(gameId, gameTeam, selectedPositionId);
    }

    static async getRemoteSensing(gameId: number, gameTeam: number) {
        return getRemoteSensing(gameId, gameTeam);
    }

    static async decreaseRemoteSensing(gameId: number) {
        return decreaseRemoteSensing(gameId);
    }

    static async insertBiologicalWeapons(gameId: number, gameTeam: number, selectedPositionId: number) {
        return insertBiologicalWeapons(gameId, gameTeam, selectedPositionId);
    }

    static async getBiologicalWeapons(gameId: number, gameTeam: number) {
        return getBiologicalWeapons(gameId, gameTeam);
    }

    static async useBiologicalWeapons(gameId: number) {
        return useBiologicalWeapons(gameId);
    }

    static async decreaseBiologicalWeapons(gameId: number) {
        return decreaseBiologicalWeapons(gameId);
    }

    static async insertRaiseMorale(gameId: number, gameTeam: number, selectedCommanderType: number) {
        return insertRaiseMorale(gameId, gameTeam, selectedCommanderType);
    }

    static async decreaseRaiseMorale(gameId: number) {
        return decreaseRaiseMorale(gameId);
    }

    static async getRaiseMorale(gameId: number, gameTeam: number) {
        return getRaiseMorale(gameId, gameTeam);
    }

    static async insertCommInterrupt(gameId: number, gameTeam: number, selectedPositionId: number) {
        return insertCommInterrupt(gameId, gameTeam, selectedPositionId);
    }

    static async getCommInterrupt(gameId: number, gameTeam: number) {
        return getCommInterrupt(gameId, gameTeam);
    }

    static async useCommInterrupt(gameId: number) {
        return useCommInterrupt(gameId);
    }

    static async decreaseCommInterrupt(gameId: any) {
        return decreaseCommInterrupt(gameId);
    }

    static async getGoldenEye(gameId: any, gameTeam: any) {
        return getGoldenEye(gameId, gameTeam);
    }

    static async insertGoldenEye(gameId: number, gameTeam: number, selectedPositionId: number) {
        return insertGoldenEye(gameId, gameTeam, selectedPositionId);
    }

    static async useGoldenEye(gameId: number) {
        return useGoldenEye(gameId);
    }

    static async decreaseGoldenEye(gameId: number) {
        return decreaseGoldenEye(gameId);
    }

    static async insertSeaMine(gameId: number, gameTeam: number, selectedPositionId: number) {
        return insertSeaMine(gameId, gameTeam, selectedPositionId);
    }

    static async getSeaMines(gameId: number, gameTeam: number) {
        return getSeaMines(gameId, gameTeam);
    }

    static async checkSeaMineHit(gameId: number) {
        return checkSeaMineHit(gameId);
    }

    static async getDroneSwarms(gameId: number, gameTeam: number) {
        return getDroneSwarms(gameId, gameTeam);
    }

    static async insertDroneSwarm(gameId: number, gameTeam: number, selectedPositionId: number) {
        return insertDroneSwarm(gameId, gameTeam, selectedPositionId);
    }

    static async checkDroneSwarmHit(gameId: number) {
        return checkDroneSwarmHit(gameId);
    }

    static async decreaseDroneSwarms(gameId: number) {
        return decreaseDroneSwarms(gameId);
    }

    static async getAtcScramble(gameId: number, gameTeam: number) {
        return getAtcScramble(gameId, gameTeam);
    }

    static async insertAtcScramble(gameId: number, gameTeam: number, selectedPositionId: number) {
        return insertAtcScramble(gameId, gameTeam, selectedPositionId);
    }

    static async decreaseAtcScramble(gameId: number) {
        return decreaseAtcScramble(gameId);
    }

    static async useAtcScramble(gameId: number) {
        return useAtcScramble(gameId);
    }
}
