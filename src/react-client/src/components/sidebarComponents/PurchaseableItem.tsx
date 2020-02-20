import React, { MouseEvent } from 'react';
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

interface Props {
    typeId: number;
    purchase: any;
}

export const PurchaseableItem = ({ typeId, purchase }: Props) => {
    const style = { ...purchaseableItemStyle, ...TYPE_IMAGES[typeId] };

    const name = TYPE_NAMES[typeId];
    const cost = TYPE_COSTS[typeId];
    const moves = TYPE_MOVES[typeId];
    const fuel = TYPE_FUEL[typeId];

    const costText = `\nCost: ${cost}`;
    const movesText = moves !== undefined && moves !== 0 ? `\nMoves: ${moves}` : '';
    const fuelText = fuel !== undefined && fuel !== -1 ? `\nFuel: ${fuel}` : '';

    const title = `${name}${costText}${movesText}${fuelText}`;

    const onClick = (event: MouseEvent) => {
        event.preventDefault();
        purchase(typeId);
        event.stopPropagation();
    };

    return <div style={style} title={title} onClick={onClick} />;
};
