import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { INV_MENU_INDEX, SHOP_MENU_INDEX, SPACE_MENU_INDEX, GAME_INFO_MENU_INDEX } from '../../../../constants';
import { GameInfoState } from '../../../../types';
import { menuSelect } from '../../redux';
import { Gameinfo } from './Gameinfo';
import InvMenu from './InvMenu';
import ShopMenu from './ShopMenu';
import SpaceArea from './SpaceArea';

const sidebarStyle: any = {
    backgroundColor: 'Red',
    position: 'absolute',
    top: '0%',
    left: '0%',
    height: '40%',
    width: '5%'
};

const buttonStyle: any = {
    position: 'absolute',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'maroon',
    left: '15%',
    width: '70%',
    paddingTop: '70%'
};

const shopButtonStyle = {
    backgroundImage: 'url("./images/graphics/shop.png")',
    top: '4%'
};

const invButtonStyle = {
    backgroundImage: 'url("./images/graphics/inventory.png")',
    top: '28%'
};

const spaceButtonStyle = {
    backgroundImage: 'url("./images/graphics/space.png")',
    top: '52%'
};

const infoButtonStyle = {
    backgroundImage: 'url("./images/graphics/infoIcon.png")',
    top: '76%'
};

const selectedButtonStyle = {
    backgroundColor: 'white'
};

interface Props {
    selectedMenu: number;
    gameInfo: GameInfoState;
    menuSelect: any;
}

class Sidebar extends Component<Props> {
    render() {
        const { gameInfo, selectedMenu, menuSelect } = this.props;

        const sidebarOnClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <div style={sidebarStyle} onClick={sidebarOnClick}>
                <ShopMenu isSelected={selectedMenu === SHOP_MENU_INDEX} />
                <InvMenu isSelected={selectedMenu === INV_MENU_INDEX} />
                <SpaceArea isSelected={selectedMenu === SPACE_MENU_INDEX} />
                <Gameinfo gameInfo={gameInfo} isSelected={selectedMenu === GAME_INFO_MENU_INDEX} />

                {/* Shop Menu Button */}
                <div
                    onClick={event => {
                        event.preventDefault();
                        menuSelect(SHOP_MENU_INDEX);
                        event.stopPropagation();
                    }}
                    style={{
                        ...buttonStyle,
                        ...shopButtonStyle,
                        ...(selectedMenu === SHOP_MENU_INDEX ? selectedButtonStyle : '')
                    }}
                />

                {/* Inv Menu Button */}
                <div
                    onClick={event => {
                        event.preventDefault();
                        menuSelect(INV_MENU_INDEX);
                        event.stopPropagation();
                    }}
                    style={{
                        ...buttonStyle,
                        ...invButtonStyle,
                        ...(selectedMenu === INV_MENU_INDEX ? selectedButtonStyle : '')
                    }}
                />

                {/* Space Menu Button */}
                <div
                    onClick={event => {
                        event.preventDefault();
                        menuSelect(SPACE_MENU_INDEX);
                        event.stopPropagation();
                    }}
                    style={{
                        ...buttonStyle,
                        ...spaceButtonStyle,
                        ...(selectedMenu === SPACE_MENU_INDEX ? selectedButtonStyle : '')
                    }}
                />

                {/* Game Info Menu Button */}
                <div
                    onClick={event => {
                        event.preventDefault();
                        menuSelect(GAME_INFO_MENU_INDEX);
                        event.stopPropagation();
                    }}
                    style={{
                        ...buttonStyle,
                        ...infoButtonStyle,
                        ...(selectedMenu === GAME_INFO_MENU_INDEX ? selectedButtonStyle : '')
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ gameInfo }: { gameInfo: GameInfoState }) => ({
    gameInfo
});

const mapActionsToProps = {
    menuSelect
};

export default connect(mapStateToProps, mapActionsToProps)(Sidebar);
