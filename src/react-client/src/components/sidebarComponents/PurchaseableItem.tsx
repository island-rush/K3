import React, { MouseEvent, useState } from 'react';
import { TYPE_COSTS, TYPE_FUEL, TYPE_MOVES, TYPE_NAMES } from '../../../../constants';
import { TYPE_IMAGES } from '../styleConstants';

const purchaseableItemStyle = {
    backgroundColor: 'grey',
    position: 'relative',
    width: '28%',
    paddingTop: '28%',
    margin: '2.5%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
};

const hoverOverStyle = {
    backgroundColor: 'green'
};

interface Props {
    typeId: number;
    purchase: any;
}

export const PurchaseableItem = ({ typeId, purchase }: Props) => {
    const [isHoveringOver, setIsHoveringOver] = useState(false);

    const style = {
        ...purchaseableItemStyle,
        ...TYPE_IMAGES[typeId],
        ...(isHoveringOver ? hoverOverStyle : null)
    };

    const moves = TYPE_MOVES[typeId];
    const fuel = TYPE_FUEL[typeId];

    const costText = `\nCost: ${TYPE_COSTS[typeId]}`;
    const movesText = moves !== undefined && moves !== 0 ? `\nMoves: ${moves}` : '';
    const fuelText = fuel !== undefined && fuel !== -1 ? `\nFuel: ${fuel}` : '';

    const title = `${TYPE_NAMES[typeId]}${costText}${movesText}${fuelText}`;

    const onClick = (event: MouseEvent) => {
        event.preventDefault();
        purchase(typeId);
        event.stopPropagation();
    };

    const onMouseOver = (event: MouseEvent) => {
        event.preventDefault();
        setIsHoveringOver(true);
        event.stopPropagation();
    };

    const onMouseLeave = (event: MouseEvent) => {
        event.preventDefault();
        setIsHoveringOver(false);
        event.stopPropagation();
    };

    return <div style={style} title={title} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} />;
};
