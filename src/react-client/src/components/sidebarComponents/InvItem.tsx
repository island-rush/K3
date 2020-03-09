import React, { MouseEvent, useState } from 'react';
import { TYPE_FUEL, TYPE_MOVES, TYPE_NAMES } from '../../../../constants';
import { InvItemType } from '../../../../types';
import { TYPE_IMAGES } from '../styleConstants';

const invItemStyle = {
    position: 'relative',
    backgroundColor: 'blue',
    width: '20%',
    paddingTop: '20%',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
};

const hoverStyle = {
    backgroundColor: 'black'
};

interface Props {
    invItem: InvItemType;
    invItemClick: (invItem: InvItemType) => void;
}

export const InvItem = ({ invItem, invItemClick }: Props) => {
    const [isHovering, setIsHovering] = useState(false);

    const { invItemTypeId } = invItem;

    const name = TYPE_NAMES[invItemTypeId];
    const moves = TYPE_MOVES[invItemTypeId];
    const fuel = TYPE_FUEL[invItemTypeId];

    const style = {
        ...invItemStyle,
        ...TYPE_IMAGES[invItemTypeId],
        ...(isHovering ? hoverStyle : null)
    };

    const movesText = moves !== undefined && moves !== 0 ? `\nMoves: ${moves}` : '';
    const fuelText = fuel !== undefined && fuel !== -1 ? `\nFuel: ${fuel}` : '';

    const title = `${name}${movesText}${fuelText}`;

    const onClick = (event: MouseEvent) => {
        event.preventDefault();
        invItemClick(invItem);
        event.stopPropagation();
    };

    const onMouseOver = (event: MouseEvent) => {
        event.preventDefault();
        setIsHovering(true);
        event.stopPropagation();
    };

    const onMouseLeave = (event: MouseEvent) => {
        event.preventDefault();
        setIsHovering(false);
        event.stopPropagation();
    };

    return <div style={style} title={title} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} />;
};
