import React, { MouseEvent, useState } from 'react';
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

const hoverStyle = {
    backgroundColor: 'black'
};

interface Props {
    shopItem: ShopItemType;
    refund: any;
}

export const ShopItem = ({ refund, shopItem }: Props) => {
    const [isHovering, setIsHovering] = useState(false);

    const style = {
        ...shopItemStyle,
        ...TYPE_IMAGES[shopItem.shopItemTypeId],
        ...(isHovering ? hoverStyle : null)
    };

    const onClick = (event: MouseEvent) => {
        event.preventDefault();
        refund(shopItem);
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

    return <div style={style} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} />;
};
