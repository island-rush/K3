import React from 'react';
import { TYPE_COSTS, TYPE_FUEL, TYPE_MOVES, TYPE_NAMES } from '../../constants/gameConstants';
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

const PurchaseableItem = ({ typeId, purchase }: Props) => {
    const style = { ...purchaseableItemStyle, ...TYPE_IMAGES[typeId] };

    const name = TYPE_NAMES[typeId];
    const cost = TYPE_COSTS[typeId];
    const moves = TYPE_MOVES[typeId];
    const fuel = TYPE_FUEL[typeId];

    const title = `${name}\nCost: ${cost}\nMoves: ${moves !== undefined ? moves : 'N/A'}\nFuel: ${fuel !== undefined && fuel !== -1 ? fuel : 'N/A'}`;

    const onClick = (event: any) => {
        event.preventDefault();
        purchase(typeId);
        event.stopPropagation();
    };

    return <div style={style} title={title} onClick={onClick} />;
};

export default PurchaseableItem;
