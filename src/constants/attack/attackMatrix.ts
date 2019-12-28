// prettier-ignore
import { BOMBER_TYPE_ID, STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID, AIR_REFUELING_SQUADRON_ID, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, AIRBORN_ISR_TYPE_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, ARTILLERY_BATTERY_TYPE_ID, TANK_COMPANY_TYPE_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID, LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID, SAM_SITE_TYPE_ID, DESTROYER_TYPE_ID, A_C_CARRIER_TYPE_ID, SUBMARINE_TYPE_ID, TRANSPORT_TYPE_ID, MC_12_TYPE_ID, C_130_TYPE_ID, SOF_TEAM_TYPE_ID, RADAR_TYPE_ID, MISSILE_TYPE_ID } from '../pieces/pieceId';
import { bomber, stealthBomber, stealthFighter, airRefuelSquad, tacAirliftSquad, airbornISR, radar } from './airPieces';
import { armyInfantry, artillery, tankCompany, marineInfantry, attackHeli, lightInfantry, sam } from './landPieces';
import { destroyer, aircraftCarrier, submarine, transport } from './seaPieces';
import { mc12, sofTeam, missile, c130 } from './specialPieces';

// TODO: fix for radar and missile (late additions)
// export const ATTACK_MATRIX = [
//     [0, 0, 0, 0, 0, 0, 11, 11, 10, 11, 0, 10, 3, 10, 9, 0, 8, 0, 0, 8, 11, 0], // bomber
//     [0, 0, 0, 0, 0, 0, 10, 10, 9, 10, 0, 9, 8, 9, 8, 0, 8, 0, 0, 8, 11, 0], // stealth bomber
//     [10, 4, 3, 11, 10, 11, 5, 5, 4, 5, 9, 6, 7, 4, 3, 0, 6, 10, 9, 8, 8, 0], // stealth fighter
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // tanker
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // air transport
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // air isr
//     [0, 0, 0, 0, 0, 0, 7, 8, 4, 8, 6, 6, 10, 0, 0, 0, 0, 2, 2, 9, 6, 0], // infantry (army)
//     [0, 0, 0, 0, 0, 0, 8, 8, 6, 7, 0, 7, 10, 0, 0, 0, 0, 0, 0, 10, 9, 0], // artillery
//     [0, 0, 0, 0, 0, 0, 7, 10, 7, 7, 2, 8, 11, 0, 0, 0, 0, 0, 0, 10, 10, 0], // tank
//     [0, 0, 0, 0, 0, 0, 8, 9, 5, 7, 3, 6, 10, 0, 0, 0, 0, 2, 2, 9, 7, 0], // infantry (marine)
//     [0, 0, 0, 0, 0, 0, 9, 10, 8, 9, 2, 10, 9, 6, 5, 0, 5, 8, 7, 10, 9, 0], // attack helicopter
//     [0, 0, 0, 0, 0, 0, 8, 8, 6, 8, 4, 7, 10, 0, 0, 0, 0, 3, 2, 9, 8, 0], // LAV
//     [10, 8, 7, 11, 10, 10, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 9, 9, 0, 0, 0], // SAM
//     [9, 0, 0, 5, 5, 5, 6, 7, 6, 6, 6, 4, 7, 7, 8, 9, 8, 3, 3, 3, 9, 0], // destroyer
//     [9, 1, 1, 3, 2, 4, 0, 0, 0, 0, 3, 0, 0, 2, 4, 2, 4, 6, 5, 0, 0, 0], // a.c. carrier
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 7, 8, 0, 0, 0, 0, 0], // submarine
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // transport
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // mc-12
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // c-130
//     [0, 0, 0, 0, 0, 0, 3, 8, 2, 3, 2, 5, 10, 0, 0, 0, 0, 0, 0, 7, 8, 0], // sof team
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // rader
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // missile
// ];

export const ATTACK_MATRIX: { [id: number]: { [id: number]: number } } = {};
ATTACK_MATRIX[BOMBER_TYPE_ID] = bomber;
ATTACK_MATRIX[STEALTH_BOMBER_TYPE_ID] = stealthBomber;
ATTACK_MATRIX[STEALTH_FIGHTER_TYPE_ID] = stealthFighter;
ATTACK_MATRIX[AIR_REFUELING_SQUADRON_ID] = airRefuelSquad;
ATTACK_MATRIX[TACTICAL_AIRLIFT_SQUADRON_TYPE_ID] = tacAirliftSquad;
ATTACK_MATRIX[AIRBORN_ISR_TYPE_ID] = airbornISR;
ATTACK_MATRIX[ARMY_INFANTRY_COMPANY_TYPE_ID] = armyInfantry;
ATTACK_MATRIX[ARTILLERY_BATTERY_TYPE_ID] = artillery;
ATTACK_MATRIX[TANK_COMPANY_TYPE_ID] = tankCompany;
ATTACK_MATRIX[MARINE_INFANTRY_COMPANY_TYPE_ID] = marineInfantry;
ATTACK_MATRIX[ATTACK_HELICOPTER_TYPE_ID] = attackHeli;
ATTACK_MATRIX[LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID] = lightInfantry;
ATTACK_MATRIX[SAM_SITE_TYPE_ID] = sam;
ATTACK_MATRIX[DESTROYER_TYPE_ID] = destroyer;
ATTACK_MATRIX[A_C_CARRIER_TYPE_ID] = aircraftCarrier;
ATTACK_MATRIX[SUBMARINE_TYPE_ID] = submarine;
ATTACK_MATRIX[TRANSPORT_TYPE_ID] = transport;
ATTACK_MATRIX[MC_12_TYPE_ID] = mc12;
ATTACK_MATRIX[C_130_TYPE_ID] = c130;
ATTACK_MATRIX[SOF_TEAM_TYPE_ID] = sofTeam;
ATTACK_MATRIX[RADAR_TYPE_ID] = radar;
ATTACK_MATRIX[MISSILE_TYPE_ID] = missile;
