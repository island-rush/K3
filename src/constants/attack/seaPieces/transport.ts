import { UNABLE_TO_HIT } from '../../globals';
// prettier-ignore
import { AIRBORN_ISR_TYPE_ID, AIR_REFUELING_SQUADRON_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, ARTILLERY_BATTERY_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID, A_C_CARRIER_TYPE_ID, BOMBER_TYPE_ID, C_130_TYPE_ID, DESTROYER_TYPE_ID, LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, MC_12_TYPE_ID, MISSILE_TYPE_ID, RADAR_TYPE_ID, SAM_SITE_TYPE_ID, SOF_TEAM_TYPE_ID, STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID, SUBMARINE_TYPE_ID, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, TANK_COMPANY_TYPE_ID, TRANSPORT_TYPE_ID } from '../../pieces/pieceId';

export const transport: { [id: number]: number } = {};
transport[BOMBER_TYPE_ID] = UNABLE_TO_HIT;
transport[STEALTH_BOMBER_TYPE_ID] = UNABLE_TO_HIT;
transport[STEALTH_FIGHTER_TYPE_ID] = UNABLE_TO_HIT;
transport[AIR_REFUELING_SQUADRON_ID] = UNABLE_TO_HIT;
transport[TACTICAL_AIRLIFT_SQUADRON_TYPE_ID] = UNABLE_TO_HIT;
transport[AIRBORN_ISR_TYPE_ID] = UNABLE_TO_HIT;
transport[ARMY_INFANTRY_COMPANY_TYPE_ID] = UNABLE_TO_HIT;
transport[ARTILLERY_BATTERY_TYPE_ID] = UNABLE_TO_HIT;
transport[TANK_COMPANY_TYPE_ID] = UNABLE_TO_HIT;
transport[MARINE_INFANTRY_COMPANY_TYPE_ID] = UNABLE_TO_HIT;
transport[ATTACK_HELICOPTER_TYPE_ID] = UNABLE_TO_HIT;
transport[LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID] = UNABLE_TO_HIT;
transport[SAM_SITE_TYPE_ID] = UNABLE_TO_HIT;
transport[DESTROYER_TYPE_ID] = UNABLE_TO_HIT;
transport[A_C_CARRIER_TYPE_ID] = UNABLE_TO_HIT;
transport[SUBMARINE_TYPE_ID] = UNABLE_TO_HIT;
transport[TRANSPORT_TYPE_ID] = UNABLE_TO_HIT;
transport[MC_12_TYPE_ID] = UNABLE_TO_HIT;
transport[C_130_TYPE_ID] = UNABLE_TO_HIT;
transport[SOF_TEAM_TYPE_ID] = UNABLE_TO_HIT;
transport[RADAR_TYPE_ID] = UNABLE_TO_HIT;
transport[MISSILE_TYPE_ID] = UNABLE_TO_HIT;
