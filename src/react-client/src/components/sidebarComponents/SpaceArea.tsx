import { Properties } from 'csstype';
import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { ANTI_SATELLITE_MISSILES_TYPE_ID } from '../../../../constants';
import { CapabilitiesState } from '../../../../types';
import { TYPE_IMAGES } from '../styleConstants';

const spaceAreaStyle: Properties = {
    backgroundColor: 'Yellow',
    position: 'absolute',
    height: '170%',
    width: '1800%',
    marginLeft: '150%',
    marginTop: '20%',
    padding: '1%',
};

const antiSatelliteMissilesContainerStyle: Properties = {
    backgroundColor: '#b9b9b9',
    position: 'absolute',
    width: '18%',
    height: '80%',
    right: '41%',
    top: '10%',
};

const antiSatBoxStyle: Properties = {
    position: 'relative',
    backgroundColor: 'blue',
    width: '20%',
    paddingTop: '20%',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
};

interface Props {
    isSelected: boolean;
    capabilities: CapabilitiesState;
}

class SpaceArea extends Component<Props> {
    render() {
        const { isSelected, capabilities } = this.props;

        if (!isSelected) {
            return null;
        }

        const { isCyberDefenseActive, confirmedAntiSat } = capabilities;

        const cyberDefenseDiv = isCyberDefenseActive ? <div>Cyber defense IS active.</div> : <div>Cyber defense is NOT active.</div>;

        const antiSatelliteMissilesItemItemComponents = confirmedAntiSat.map((antiSatRoundsLeft: number, index: number) => (
            <div style={{ ...antiSatBoxStyle, ...TYPE_IMAGES[ANTI_SATELLITE_MISSILES_TYPE_ID] }}>{antiSatRoundsLeft}</div>
        ));

        const standardOnClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <div style={spaceAreaStyle} onClick={standardOnClick}>
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
    capabilities,
});

export default connect(mapStateToProps)(SpaceArea);
