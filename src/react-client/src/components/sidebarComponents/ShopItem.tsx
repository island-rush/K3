import React from 'react';
import { TYPE_IMAGES } from '../styleConstants';
import { ShopItemType } from '../../constants/interfaces';

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
    refund: any;
    shopItem: ShopItemType;
}

const ShopItem = ({ refund, shopItem }: Props) => {
    const style = {
        ...shopItemStyle,
        ...TYPE_IMAGES[shopItem.shopItemTypeId]
    };

    const onClick = (event: any) => {
        event.preventDefault();
        refund(shopItem);
        event.stopPropagation();
    };

    return <div style={style} onClick={onClick} />;
};

export default ShopItem;
