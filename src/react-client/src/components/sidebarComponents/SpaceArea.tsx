import React, { Component } from "react";
import { connect } from "react-redux";
import { ANTI_SATELLITE_MISSILES_TYPE_ID, REMOTE_SENSING_TYPE_ID, RODS_FROM_GOD_TYPE_ID } from "../../constants/gameConstants";
import { antiSatelliteMissiles, remoteSensing, rodsFromGod } from "../../redux/actions";
import InvItem from "./InvItem";
import { InvItemType } from "../../constants/interfaces";

const spaceAreaStyle: any = {
    backgroundColor: "Yellow",
    position: "absolute",
    height: "170%",
    width: "1800%",
    marginLeft: "150%",
    marginTop: "20%",
    padding: "1%"
};

const remoteSensingContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    right: "81%",
    top: "10%"
};

const rodsfromGodContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    right: "61%",
    top: "10%"
};

const antiSatelliteMissilesContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    right: "41%",
    top: "10%"
};

const future1ContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    right: "21%",
    top: "10%"
};

const future2ContainerStyle: any = {
    backgroundColor: "pink",
    position: "absolute",
    width: "18%",
    height: "80%",
    left: "81%",
    top: "10%"
};

const invisibleStyle = {
    display: "none"
};

interface Props {
    selected: boolean;
    invItems: InvItemType[];
    remoteSensing: any;
    rodsFromGod: any;
    antiSatelliteMissiles: any;
}

class SpaceArea extends Component<Props> {
    render() {
        const { selected, invItems, remoteSensing, rodsFromGod, antiSatelliteMissiles } = this.props;

        let capabilityFunctions: any = {};
        capabilityFunctions[REMOTE_SENSING_TYPE_ID] = remoteSensing;
        capabilityFunctions[RODS_FROM_GOD_TYPE_ID] = rodsFromGod;
        capabilityFunctions[ANTI_SATELLITE_MISSILES_TYPE_ID] = antiSatelliteMissiles;

        const remoteSensingItems = invItems.filter((invItem: InvItemType) => {
            return invItem.invItemTypeId === REMOTE_SENSING_TYPE_ID;
        });

        const rodsfromGodItems = invItems.filter((invItem: InvItemType) => {
            return invItem.invItemTypeId === RODS_FROM_GOD_TYPE_ID;
        });

        const antiSatelliteMissilesItems = invItems.filter((invItem: InvItemType) => {
            return invItem.invItemTypeId === ANTI_SATELLITE_MISSILES_TYPE_ID;
        });

        const remoteSensingItemItemComponents = remoteSensingItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={capabilityFunctions[invItem.invItemTypeId]} />
        ));

        const rodsfromGodItemItemComponents = rodsfromGodItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={capabilityFunctions[invItem.invItemTypeId]} />
        ));

        const antiSatelliteMissilesItemItemComponents = antiSatelliteMissilesItems.map((invItem: InvItemType, index: number) => (
            <InvItem key={index} invItem={invItem} invItemClick={capabilityFunctions[invItem.invItemTypeId]} />
        ));

        return (
            <div style={selected ? spaceAreaStyle : invisibleStyle}>
                <div>Space Area Capabilities</div>
                {/* TODO: capabilities is first as a div, but last as a style, make these consistent with style? / rearange these to be in correct order */}
                <div style={remoteSensingContainerStyle}>
                    <div>Remote Sensing</div>
                    {remoteSensingItemItemComponents}
                </div>

                <div style={rodsfromGodContainerStyle}>
                    <div>Rods from God</div>
                    {rodsfromGodItemItemComponents}
                </div>
                <div style={antiSatelliteMissilesContainerStyle}>
                    <div>Anti Satellite Missiles</div>
                    {antiSatelliteMissilesItemItemComponents}
                </div>
                <div style={future1ContainerStyle}>
                    <div>TBD</div>
                </div>
                <div style={future2ContainerStyle}>
                    <div>TBD</div>
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
    //TODO: refactor to use names / variables instead of hard coded numbers? (refactor to throw these in an object/array)
    remoteSensing,
    rodsFromGod,
    antiSatelliteMissiles
};

export default connect(mapStateToProps, mapActionsToProps)(SpaceArea);
