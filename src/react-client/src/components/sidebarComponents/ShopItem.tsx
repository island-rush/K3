import React, { MouseEvent } from 'react';
import { ShopItemType } from '../../../../types';
import { TYPE_IMAGES } from '../styleConstants';

const shopItemStyle = {
    backgroundColor: 'green',
    position: 'relative',
    width: '23%',
    paddingTop: '23%',
    margin: '1%',
    float: 'left',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
};

interface Props {
    shopItem: ShopItemType;
    refund: any;
}

export const ShopItem = ({ refund, shopItem }: Props) => {
    const style = {
        ...shopItemStyle,
        ...TYPE_IMAGES[shopItem.shopItemTypeId]
    };

    const onClick = (event: MouseEvent) => {
        event.preventDefault();
        refund(shopItem);
        event.stopPropagation();
    };

    return <div style={style} onClick={onClick} />;
};
