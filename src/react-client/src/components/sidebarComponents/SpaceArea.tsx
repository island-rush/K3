import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ANTI_SATELLITE_MISSILES_TYPE_ID } from '../../../../constants';
import { CapabilitiesState } from '../../../../types';
import { TYPE_IMAGES } from '../styleConstants';

const spaceAreaStyle: any = {
    backgroundColor: 'Yellow',
    position: 'absolute',
    height: '170%',
    width: '1800%',
    marginLeft: '150%',
    marginTop: '20%',
    padding: '1%'
};

const antiSatelliteMissilesContainerStyle: any = {
    backgroundColor: '#b9b9b9',
    position: 'absolute',
    width: '18%',
    height: '80%',
    right: '41%',
    top: '10%'
};

const antiSatBoxStyle: any = {
    position: 'relative',
    backgroundColor: 'blue',
    width: '20%',
    paddingTop: '20%',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
};

const invisibleStyle = {
    display: 'none'
};

interface Props {
    isSelected: boolean;
    capabilities: CapabilitiesState;
}

class SpaceArea extends Component<Props> {
    render() {
        const { isSelected, capabilities } = this.props;

        const { isCyberDefenseActive } = capabilities;

        const antiSatelliteMissilesItemItemComponents = capabilities.confirmedAntiSat.map((antiSatRoundsLeft: number, index: number) => (
            <div style={{ ...antiSatBoxStyle, ...TYPE_IMAGES[ANTI_SATELLITE_MISSILES_TYPE_ID] }}>{antiSatRoundsLeft}</div>
        ));

        const cyberDefenseDiv = isCyberDefenseActive ? <div>Cyber defense is active.</div> : null;

        return (
            <div style={isSelected ? spaceAreaStyle : invisibleStyle}>
                <div>Space Area Capabilities</div>
                {cyberDefenseDiv}
                <div style={antiSatelliteMissilesContainerStyle}>
                    <div>Anti Satellite Missiles</div>
                    {antiSatelliteMissilesItemItemComponents}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ capabilities }: { capabilities: CapabilitiesState }) => ({
    capabilities
});

export default connect(mapStateToProps)(SpaceArea);
