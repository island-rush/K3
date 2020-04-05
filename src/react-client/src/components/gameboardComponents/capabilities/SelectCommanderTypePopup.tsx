import { Properties } from 'csstype';
import React, { MouseEvent } from 'react';
import { TYPE_AIR, TYPE_LAND, TYPE_SEA, TYPE_SPECIAL } from '../../../../../constants';
import { PlanningState } from '../../../../../types';

const popupStyle: Properties = {
    backgroundColor: 'white',
    width: '50%',
    height: '30%',
    top: '25%',
    right: '25%',
    position: 'absolute'
};

const titleStyle: Properties = {
    textAlign: 'center'
};

const buttonStyle: Properties = {
    float: 'left',
    backgroundColor: 'grey',
    margin: '5%',
    padding: '5%'
};

interface Props {
    raiseMoraleSelectCommanderType: any;
    planning: PlanningState;
}

export const SelectCommanderTypePopup = ({ raiseMoraleSelectCommanderType, planning }: Props) => {
    const { isSelectingCommander } = planning;

    if (!isSelectingCommander) {
        return null;
    }

    const standardOnClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div style={popupStyle} onClick={standardOnClick}>
            <div style={titleStyle}>Select a commander type to boost.</div>

            <div
                style={buttonStyle}
                onClick={event => {
                    event.preventDefault();
                    raiseMoraleSelectCommanderType(TYPE_AIR);
                    event.stopPropagation();
                }}
            >
                Air
            </div>

            <div
                style={buttonStyle}
                onClick={event => {
                    event.preventDefault();
                    raiseMoraleSelectCommanderType(TYPE_LAND);
                    event.stopPropagation();
                }}
            >
                Land
            </div>

            <div
                style={buttonStyle}
                onClick={event => {
                    event.preventDefault();
                    raiseMoraleSelectCommanderType(TYPE_SEA);
                    event.stopPropagation();
                }}
            >
                Sea
            </div>

            <div
                style={buttonStyle}
                onClick={event => {
                    event.preventDefault();
                    raiseMoraleSelectCommanderType(TYPE_SPECIAL);
                    event.stopPropagation();
                }}
            >
                Special
            </div>
        </div>
    );
};
