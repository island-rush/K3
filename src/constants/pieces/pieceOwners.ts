import { TYPE_AIR, TYPE_LAND, TYPE_MAIN, TYPE_SEA, TYPE_SPECIAL } from '../globals';
// prettier-ignore
import { AIRBORN_ISR_TYPE_ID, AIR_REFUELING_SQUADRON_ID, ANTI_SATELLITE_MISSILES_TYPE_ID, ARMY_INFANTRY_COMPANY_TYPE_ID, ARTILLERY_BATTERY_TYPE_ID, ATC_SCRAMBLE_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID, A_C_CARRIER_TYPE_ID, BIOLOGICAL_WEAPONS_TYPE_ID, BOMBER_TYPE_ID, COMMUNICATIONS_INTERRUPTION_TYPE_ID, CYBER_DOMINANCE_TYPE_ID, C_130_TYPE_ID, DESTROYER_TYPE_ID, DRONE_SWARMS_TYPE_ID, GOLDEN_EYE_TYPE_ID, INSURGENCY_TYPE_ID, LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID, MARINE_INFANTRY_COMPANY_TYPE_ID, MC_12_TYPE_ID, MISSILE_LAUNCH_DISRUPTION_TYPE_ID, MISSILE_TYPE_ID, NUCLEAR_STRIKE_TYPE_ID, RADAR_TYPE_ID, RAISE_MORALE_TYPE_ID, REMOTE_SENSING_TYPE_ID, RODS_FROM_GOD_TYPE_ID, SAM_SITE_TYPE_ID, SEA_MINES_TYPE_ID, SOF_TEAM_TYPE_ID, STEALTH_BOMBER_TYPE_ID, STEALTH_FIGHTER_TYPE_ID, SUBMARINE_TYPE_ID, TACTICAL_AIRLIFT_SQUADRON_TYPE_ID, TANK_COMPANY_TYPE_ID, TRANSPORT_TYPE_ID, CYBER_DOM_CHECK_TYPE_ID } from './pieceId';

// TODO: re-work capability constants to be less involved with piece constants (separate TYPE into PIECETYPE and CAPABILITYTYPE)
// This is especially misleading when it is used in ShopMenu (auto-creating PurchaseItems based on these constants...)
// These represent controller numbers
// TODO: don't do capabilities in this file

export const TYPE_OWNERS: { [id: number]: number[] } = {};
// Main has master control over capabilities
TYPE_OWNERS[TYPE_MAIN] = [
    ATC_SCRAMBLE_TYPE_ID,
    CYBER_DOMINANCE_TYPE_ID,
    MISSILE_LAUNCH_DISRUPTION_TYPE_ID,
    COMMUNICATIONS_INTERRUPTION_TYPE_ID,
    REMOTE_SENSING_TYPE_ID,
    RODS_FROM_GOD_TYPE_ID,
    ANTI_SATELLITE_MISSILES_TYPE_ID,
    GOLDEN_EYE_TYPE_ID,
    NUCLEAR_STRIKE_TYPE_ID,
    BIOLOGICAL_WEAPONS_TYPE_ID,
    SEA_MINES_TYPE_ID,
    DRONE_SWARMS_TYPE_ID,
    INSURGENCY_TYPE_ID,
    RAISE_MORALE_TYPE_ID,
    CYBER_DOM_CHECK_TYPE_ID
];

TYPE_OWNERS[TYPE_AIR] = [
    RADAR_TYPE_ID,
    BOMBER_TYPE_ID,
    STEALTH_BOMBER_TYPE_ID,
    STEALTH_FIGHTER_TYPE_ID,
    AIR_REFUELING_SQUADRON_ID,
    TACTICAL_AIRLIFT_SQUADRON_TYPE_ID,
    AIRBORN_ISR_TYPE_ID
];

TYPE_OWNERS[TYPE_LAND] = [
    ARMY_INFANTRY_COMPANY_TYPE_ID,
    ARTILLERY_BATTERY_TYPE_ID,
    TANK_COMPANY_TYPE_ID,
    MARINE_INFANTRY_COMPANY_TYPE_ID,
    ATTACK_HELICOPTER_TYPE_ID,
    LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID,
    SAM_SITE_TYPE_ID
];

TYPE_OWNERS[TYPE_SEA] = [DESTROYER_TYPE_ID, A_C_CARRIER_TYPE_ID, SUBMARINE_TYPE_ID, TRANSPORT_TYPE_ID];

export const ALL_SURFACE_SHIP_TYPES = [DESTROYER_TYPE_ID, A_C_CARRIER_TYPE_ID, TRANSPORT_TYPE_ID];

TYPE_OWNERS[TYPE_SPECIAL] = [MC_12_TYPE_ID, C_130_TYPE_ID, SOF_TEAM_TYPE_ID, MISSILE_TYPE_ID];
