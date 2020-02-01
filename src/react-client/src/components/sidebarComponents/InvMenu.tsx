import React, { Component } from 'react';
import { connect } from 'react-redux';
//prettier-ignore
import { ANTI_SATELLITE_MISSILES_TYPE_ID, ATC_SCRAMBLE_TYPE_ID, BIOLOGICAL_WEAPONS_TYPE_ID, COMMUNICATIONS_INTERRUPTION_TYPE_ID, CYBER_DOMINANCE_TYPE_ID, CYBER_DOM_CHECK_TYPE_ID, DRONE_SWARMS_TYPE_ID, GOLDEN_EYE_TYPE_ID, INSURGENCY_TYPE_ID, LIST_ALL_CAPABILITIES, MISSILE_LAUNCH_DISRUPTION_TYPE_ID, NUCLEAR_STRIKE_TYPE_ID, RAISE_MORALE_TYPE_ID, REMOTE_SENSING_TYPE_ID, RODS_FROM_GOD_TYPE_ID, SEA_MINES_TYPE_ID, TYPE_AIR, TYPE_LAND, TYPE_OWNERS, TYPE_SEA, TYPE_SPECIAL } from "../../../../constants";
import { CapabilitiesState, InvItemType, InvState } from '../../../../types';
//prettier-ignore
import { antiSatelliteMissiles, atcScramble, biologicalWeapons, communicationsInterruption, cyberDefenseCheck, cyberDominance, droneSwarms, goldenEye, insurgency, invPieceClick, missileLaunchDisruption, nuclearStrike, raiseMorale, remoteSensing, rodsFromGod, seaMines } from "../../redux";
import { InvItem } from './InvItem';

const inventoryStyle: any = {
    backgroundColor: 'Yellow',
    position: 'absolute',
    height: '170%',
    width: '1800%',
    marginLeft: '150%',
    marginTop: '20%',
    padding: '1%'
};

const invisibleStyle: any = {
    display: 'none'
};

const airpieceItemsContainerStyle: any = {
    backgroundColor: '#b9b9b9',
    position: 'absolute',
    width: '18%',
    height: '80%',
    right: '81%',
    top: '10%'
};

const landpieceItemsContainerStyle: any = {
    backgroundColor: '#b9b9b9',
    position: 'absolute',
    width: '18%',
    height: '80%',
    right: '61%',
    top: '10%'
};

const seapieceItemsContainerStyle: any = {
    backgroundColor: '#b9b9b9',
    position: 'absolute',
    width: '18%',
    height: '80%',
    right: '41%',
    top: '10%'
};

const specialpieceItemsContainerStyle: any = {
    backgroundColor: '#b9b9b9',
    position: 'absolute',
    width: '18%',
    height: '80%',
    right: '21%',
    top: '10%'
};

const warfareItemsContainerStyle: any = {
    backgroundColor: '#b9b9b9',
    position: 'absolute',
    width: '18%',
    height: '80%',
    left: '81%',
    top: '10%'
};

const itemCount = (array: any, value: any) => {
    return array.filter((v: any) => v === value).length;
};

interface Props {
    isSelected: boolean;
    invItems: InvState;
    confirmedRaiseMorale: number[];
    invPieceClick: any;
    atcScramble: any;
    cyberDominance: any;
    missileLaunchDisruption: any;
    communicationsInterruption: any;
    remoteSensing: any;
    rodsFromGod: any;
    antiSatelliteMissiles: any;
    goldenEye: any;
    nuclearStrike: any;
    biologicalWeapons: any;
    seaMines: any;
    droneSwarms: any;
    insurgency: any;
    raiseMorale: any;
    cyberDefenseCheck: any;
}

class InvMenu extends Component<Props> {
    render() {
        //prettier-ignore
        const { invPieceClick, cyberDefenseCheck, confirmedRaiseMorale, isSelected, invItems, atcScramble, cyberDominance, missileLaunchDisruption, communicationsInterruption, remoteSensing, rodsFromGod, antiSatelliteMissiles, goldenEye, nuclearStrike, biologicalWeapons, seaMines, droneSwarms, insurgency, raiseMorale } = this.props;

        // TODO: change this to call a central redux capability function which then determined which sub-capability (these) to call
        let capabilityFunctions: any = {};
        capabilityFunctions[ATC_SCRAMBLE_TYPE_ID] = atcScramble;
        capabilityFunctions[CYBER_DOMINANCE_TYPE_ID] = cyberDominance;
        capabilityFunctions[MISSILE_LAUNCH_DISRUPTION_TYPE_ID] = missileLaunchDisruption;
        capabilityFunctions[COMMUNICATIONS_INTERRUPTION_TYPE_ID] = communicationsInterruption;
        capabilityFunctions[REMOTE_SENSING_TYPE_ID] = remoteSensing;
        capabilityFunctions[RODS_FROM_GOD_TYPE_ID] = rodsFromGod;
        capabilityFunctions[ANTI_SATELLITE_MISSILES_TYPE_ID] = antiSatelliteMissiles;
        capabilityFunctions[GOLDEN_EYE_TYPE_ID] = goldenEye;
        capabilityFunctions[NUCLEAR_STRIKE_TYPE_ID] = nuclearStrike;
        capabilityFunctions[BIOLOGICAL_WEAPONS_TYPE_ID] = biologicalWeapons;
        capabilityFunctions[SEA_MINES_TYPE_ID] = seaMines;
        capabilityFunctions[DRONE_SWARMS_TYPE_ID] = droneSwarms;
        capabilityFunctions[INSURGENCY_TYPE_ID] = insurgency;
        capabilityFunctions[RAISE_MORALE_TYPE_ID] = raiseMorale;
        capabilityFunctions[CYBER_DOM_CHECK_TYPE_ID] = cyberDefenseCheck;

        const airItems = invItems.filter((invItem: InvItemType) => {
            return TYPE_OWNERS[TYPE_AIR].includes(invItem.invItemTypeId);
        });
        const airInvComponents = airItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={invPieceClick} />
        ));

        const landItems = invItems.filter((invItem: InvItemType) => {
            return TYPE_OWNERS[TYPE_LAND].includes(invItem.invItemTypeId);
        });
        const landInvComponents = landItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={invPieceClick} />
        ));

        const seaItems = invItems.filter((invItem: InvItemType) => {
            return TYPE_OWNERS[TYPE_SEA].includes(invItem.invItemTypeId);
        });
        const seaInvComponents = seaItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={invPieceClick} />
        ));

        const specialItems = invItems.filter((invItem: InvItemType) => {
            return TYPE_OWNERS[TYPE_SPECIAL].includes(invItem.invItemTypeId);
        });
        const specialInvComponents = specialItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={invPieceClick} />
        ));

        const capabilityItems = invItems.filter((invItem: InvItemType) => {
            return LIST_ALL_CAPABILITIES.includes(invItem.invItemTypeId);
        });
        const capabilityItemComponents = capabilityItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={capabilityFunctions[invItem.invItemTypeId]} />
        ));

        // number of boosts from raise morale
        const airItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_AIR);
        const landItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_LAND);
        const seaItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_SEA);
        const specialItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_SPECIAL);

        return (
            <div style={isSelected ? inventoryStyle : invisibleStyle}>
                <div>Inventory Section for Purchased Items</div>

                <div style={airpieceItemsContainerStyle}>
                    <div> Air Pieces</div>
                    <div> Boost = {airItemMoveBoost}</div>
                    {airInvComponents}
                </div>

                <div style={landpieceItemsContainerStyle}>
                    <div>Land Pieces</div>
                    <div> Boost = {landItemMoveBoost}</div>
                    {landInvComponents}
                </div>

                <div style={seapieceItemsContainerStyle}>
                    <div>Maritime Pieces</div>
                    <div> Boost = {seaItemMoveBoost}</div>
                    {seaInvComponents}
                </div>

                <div style={specialpieceItemsContainerStyle}>
                    <div>SOF Pieces</div>
                    <div> Boost = {specialItemMoveBoost}</div>
                    {specialInvComponents}
                </div>

                <div style={warfareItemsContainerStyle}>
                    <div>Capabilities</div>
                    {capabilityItemComponents}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ invItems, capabilities }: { invItems: InvState; capabilities: CapabilitiesState }) => ({
    invItems,
    confirmedRaiseMorale: capabilities.confirmedRaiseMorale
});

const mapActionsToProps = {
    invPieceClick,
    atcScramble,
    cyberDominance,
    missileLaunchDisruption,
    communicationsInterruption,
    remoteSensing,
    rodsFromGod,
    antiSatelliteMissiles,
    goldenEye,
    nuclearStrike,
    biologicalWeapons,
    seaMines,
    droneSwarms,
    insurgency,
    raiseMorale,
    cyberDefenseCheck
};

export default connect(mapStateToProps, mapActionsToProps)(InvMenu);
