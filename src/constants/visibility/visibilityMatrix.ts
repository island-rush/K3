// prettier-ignore
import { AIRBORN_ISR_TYPE_ID, AIR_REFUELING_SQUADRON_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, ARTILLERY_BATTERY_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID, A_C_CARRIER_TYPE_ID, BOMBER_TYPE_ID, C_130_TYPE_ID, DESTROYER_TYPE_ID, LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, MC_12_TYPE_ID, MISSILE_TYPE_ID, RADAR_TYPE_ID, SAM_SITE_TYPE_ID, SOF_TEAM_TYPE_ID, STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID, SUBMARINE_TYPE_ID, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, TANK_COMPANY_TYPE_ID, TRANSPORT_TYPE_ID } from '../pieces/pieceId';
import { airbornISR, airRefuelSquad, bomber, radar, stealthBomber, stealthFighter, tacAirliftSquad } from './airPieces';
import { armyInfantry, artillery, attackHeli, lightInfantry, marineInfantry, sam, tankCompany } from './landPieces';
import { aircraftCarrier, destroyer, submarine, transport } from './seaPieces';
import { c130, mc12, missile, sofTeam } from './specialPieces';

// used the updated units excel at https://docs.google.com/spreadsheets/d/1kiMLv05oK6IZKtiYdErvD4Kp5tI3lXLL2-qbO3ZqHAI/edit#gid=306372336
// TODO: fix for radar and missile (late additions)
// TODO: shouldn't assume we know the index for the pieces, do it the long way for guaranteed safety (bug with radar id == 34 -> will add more pieces later probably?)
// export const VISIBILITY_MATRIX = [
//     [1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, -1, 2, 1, 1, -1, 2, -1], // bomber
//     [1, 0, -1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, -1, 2, 1, 1, -1, 2, -1], // stealth bomber
//     [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, -1, 2, 1, 1, -1, 2, -1], // stealth fighter
//     [0, -1, -1, 0, 1, 0, 0, -1, -1, -1, 0, -1, -1, 0, 0, -1, 0, 0, 1, -1, 0, -1], // tanker
//     [0, -1, -1, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, -1, 0, -1], // air transport
//     [2, 0, 0, 2, 2, 2, -1, -1, -1, -1, 2, -1, -1, 0, 0, -1, 0, 2, 2, -1, 0, -1], // air isr
//     [-1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, -1, -1, 0, 1, -1], // infantry (army)
//     [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 0, 0, -1, 0, -1, -1, 0, 1, -1], // artillery
//     [-1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, -1, -1, 0, 1, -1], // tank
//     [-1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, -1, -1, 0, 1, -1], // infantry (marine)
//     [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 0, 1, 0, 2, -1], // attack helicopter
//     [-1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, -1, -1, 0, 1, -1], // LAV
//     [2, 0, 0, 2, 2, 2, -1, -1, -1, -1, 2, -1, 0, -1, -1, -1, -1, 1, 2, -1, -1, -1], // SAM
//     [0, -1, -1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, -1, 1, -1], // destroyer
//     [0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, -1, 1, 0, 1, -1, 0, -1], // a.c. carrier
//     [-1, -1, -1, -1, -1, -1, 0, 0, 0, 0, -1, 0, 0, 1, 1, 1, 1, -1, -1, -1, -1, -1], // submarine
//     [0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, -1, 0, -1], // transport
//     [-1, -1, -1, -1, -1, -1, 2, 2, 2, 2, 1, 2, 2, 2, 2, -1, 2, 1, 0, 1, 3, -1], // mc-12
//     [0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, -1, 1, 1, 1, -1, 1, -1], // c-130
//     [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 0, 0, -1, 0, 0, 0, 0, 1, -1], // sof team
//     [3, 1, 1, 3, 3, 3, 1, 2, 2, 1, 2, 2, 2, 3, 3, -1, 3, 2, 2, 0, 3, -1], // radar
//     [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1] // missile
// ];

export const VISIBILITY_MATRIX: { [id: number]: { [id: number]: number } } = {};
VISIBILITY_MATRIX[BOMBER_TYPE_ID] = bomber;
VISIBILITY_MATRIX[STEALTH_BOMBER_TYPE_ID] = stealthBomber;
VISIBILITY_MATRIX[STEALTH_FIGHTER_TYPE_ID] = stealthFighter;
VISIBILITY_MATRIX[AIR_REFUELING_SQUADRON_ID] = airRefuelSquad;
VISIBILITY_MATRIX[TACTICAL_AIRLIFT_SQUADRON_TYPE_ID] = tacAirliftSquad;
VISIBILITY_MATRIX[AIRBORN_ISR_TYPE_ID] = airbornISR;
VISIBILITY_MATRIX[ARMY_INFANTRY_COMPANY_TYPE_ID] = armyInfantry;
VISIBILITY_MATRIX[ARTILLERY_BATTERY_TYPE_ID] = artillery;
VISIBILITY_MATRIX[TANK_COMPANY_TYPE_ID] = tankCompany;
VISIBILITY_MATRIX[MARINE_INFANTRY_COMPANY_TYPE_ID] = marineInfantry;
VISIBILITY_MATRIX[ATTACK_HELICOPTER_TYPE_ID] = attackHeli;
VISIBILITY_MATRIX[LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID] = lightInfantry;
VISIBILITY_MATRIX[SAM_SITE_TYPE_ID] = sam;
VISIBILITY_MATRIX[DESTROYER_TYPE_ID] = destroyer;
VISIBILITY_MATRIX[A_C_CARRIER_TYPE_ID] = aircraftCarrier;
VISIBILITY_MATRIX[SUBMARINE_TYPE_ID] = submarine;
VISIBILITY_MATRIX[TRANSPORT_TYPE_ID] = transport;
VISIBILITY_MATRIX[MC_12_TYPE_ID] = mc12;
VISIBILITY_MATRIX[C_130_TYPE_ID] = c130;
VISIBILITY_MATRIX[SOF_TEAM_TYPE_ID] = sofTeam;
VISIBILITY_MATRIX[RADAR_TYPE_ID] = radar;
VISIBILITY_MATRIX[MISSILE_TYPE_ID] = missile;
