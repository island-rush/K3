import React, { Component } from "react";
import { connect } from "react-redux";
//prettier-ignore
import { ANTI_SATELLITE_MISSILES_TYPE_ID, ATC_SCRAMBLE_TYPE_ID, BIOLOGICAL_WEAPONS_TYPE_ID, COMMUNICATIONS_INTERRUPTION_TYPE_ID, CYBER_DOMINANCE_TYPE_ID, DRONE_SWARMS_TYPE_ID, GOLDEN_EYE_TYPE_ID, INSURGENCY_TYPE_ID, LIST_ALL_CAPABILITIES, MISSILE_LAUNCH_DISRUPTION_TYPE_ID, NUCLEAR_STRIKE_TYPE_ID, RAISE_MORALE_TYPE_ID, REMOTE_SENSING_TYPE_ID, RODS_FROM_GOD_TYPE_ID, SEA_MINES_TYPE_ID, SOF_TEAM_TYPE_ID, TYPE_AIR, TYPE_LAND, TYPE_OWNERS, TYPE_SEA, TYPE_SPECIAL } from "../../constants/gameConstants";
//prettier-ignore
import { airPieceClick, antiSatelliteMissiles, atcScamble, biologicalWeapons, communicationsInterruption, cyberDominance, droneSwarms, goldenEye, insurgency, landPieceClick, missileLaunchDisruption, nuclearStrike, raiseMorale, remoteSensing, rodsFromGod, seaMines, seaPieceClick } from "../../redux/actions";
import InvItem from "./InvItem";
import { InvItemType } from "../../constants/interfaces";

const inventoryStyle: any = {
    backgroundColor: "Yellow",
    position: "absolute",
    height: "170%",
    width: "1800%",
    marginLeft: "150%",
    marginTop: "20%",
    padding: "1%"
};

const invisibleStyle: any = {
    display: "none"
};

const airpieceItemsContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    right: "81%",
    top: "10%"
};

const landpieceItemsContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    right: "61%",
    top: "10%"
};

const seapieceItemsContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    right: "41%",
    top: "10%"
};

const specialpieceItemsContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    right: "21%",
    top: "10%"
};

const warfareItemsContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    left: "81%",
    top: "10%"
};

const itemCount = (array: any, value: any) => {
    return array.filter((v: any) => v === value).length;
};

interface Props {
    confirmedRaiseMorale: any;
    selected: boolean;
    invItems: InvItemType[];
    airPieceClick: any;
    landPieceClick: any;
    seaPieceClick: any;
    atcScamble: any;
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
}

class InvMenu extends Component<Props> {
    render() {
        //TODO: selected is a poorly chosen variable name, change to MenuIsVisible or something (since selected is used for other components too)
        //prettier-ignore
        const { confirmedRaiseMorale, selected, invItems, airPieceClick, landPieceClick, seaPieceClick, atcScamble, cyberDominance, missileLaunchDisruption, communicationsInterruption, remoteSensing, rodsFromGod, antiSatelliteMissiles, goldenEye, nuclearStrike, biologicalWeapons, seaMines, droneSwarms, insurgency, raiseMorale } = this.props;

        let capabilityFunctions: any = {};
        capabilityFunctions[ATC_SCRAMBLE_TYPE_ID] = atcScamble;
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

        const airItems = invItems.filter((invItem: InvItemType) => {
            return TYPE_OWNERS[TYPE_AIR].includes(invItem.invItemTypeId);
        });
        const landItems = invItems.filter((invItem: InvItemType) => {
            return TYPE_OWNERS[TYPE_LAND].includes(invItem.invItemTypeId);
        });
        const seaItems = invItems.filter((invItem: InvItemType) => {
            return TYPE_OWNERS[TYPE_SEA].includes(invItem.invItemTypeId);
        });
        const specialItems = invItems.filter((invItem: InvItemType) => {
            return TYPE_OWNERS[TYPE_SPECIAL].includes(invItem.invItemTypeId);
        });
        const capabilityItems = invItems.filter((invItem: InvItemType) => {
            return LIST_ALL_CAPABILITIES.includes(invItem.invItemTypeId);
        });

        const airInvComponents = airItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={airPieceClick} />
        ));
        const landInvComponents = landItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={landPieceClick} />
        )); //TODO: are helicopters special? (placed not on land?) -> determine other special cases if able
        const seaInvComponents = seaItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={seaPieceClick} />
        ));

        //SOF team is the only land piece in special group, others are air pieces
        const specialInvComponents = specialItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={invItem.invItemTypeId === SOF_TEAM_TYPE_ID ? landPieceClick : airPieceClick} />
        ));

        const capabilityItemComponents = capabilityItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={capabilityFunctions[invItem.invItemTypeId]} />
        ));

        //number of boosts from raise morale
        const airItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_AIR);
        const landItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_LAND);
        const seaItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_SEA);
        const specialItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_SPECIAL);

        return (
            <div style={selected ? inventoryStyle : invisibleStyle}>
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

const mapStateToProps = ({ invItems, gameboardMeta }: { invItems: InvItemType[]; gameboardMeta: any }) => ({
    invItems,
    confirmedRaiseMorale: gameboardMeta.confirmedRaiseMorale
});

const mapActionsToProps = {
    airPieceClick,
    landPieceClick,
    seaPieceClick,
    //TODO: refactor to use names / variables instead of hard coded numbers? (refactor to throw these in an object/array)
    atcScamble,
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
    raiseMorale
};

export default connect(mapStateToProps, mapActionsToProps)(InvMenu);
