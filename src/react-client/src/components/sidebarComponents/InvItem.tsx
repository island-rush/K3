import React from 'react';
import { TYPE_FUEL, TYPE_MOVES, TYPE_NAMES } from '../../../../constants';
import { InvItemType } from '../../interfaces/classTypes';
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

interface Props {
    invItem: InvItemType;
    invItemClick: any;
}

const InvItem = ({ invItem, invItemClick }: Props) => {
    const { invItemTypeId } = invItem;

    const name = TYPE_NAMES[invItemTypeId];
    const moves = TYPE_MOVES[invItemTypeId];
    const fuel = TYPE_FUEL[invItemTypeId];

    const style = {
        ...invItemStyle,
        ...TYPE_IMAGES[invItemTypeId]
    };

    const title = `${name}\nMoves: ${moves !== undefined ? moves : 'N/A'}\nFuel: ${fuel !== undefined && fuel !== -1 ? fuel : 'N/A'}`;

    const onClick = (event: any) => {
        event.preventDefault();
        invItemClick(invItem);
        event.stopPropagation();
    };

    return <div style={style} title={title} onClick={onClick} />;
};

export default InvItem;
