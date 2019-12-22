import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearPieceSelection, menuSelect, selectPosition } from '../redux/actions';
import Bottombar from './bottombarComponents/Bottombar';
import Gameboard from './gameboardComponents/Gameboard';
import Sidebar from './sidebarComponents/Sidebar';
import Zoombox from './zoomboxComponents/Zoombox';

const appStyle: any = {
    position: 'relative',
    backgroundColor: 'blue',
    height: '100%',
    width: '100%'
};

const isPlanningStyle: any = {
    backgroundColor: 'yellow'
};

interface Props {
    gameboardMeta: any;
    selectPosition(someNum: number): any;
    menuSelect(menuId: number): any;
    clearPieceSelection(): any;
}

class App extends Component<Props> {
    render() {
        const { gameboardMeta, selectPosition, menuSelect, clearPieceSelection } = this.props;

        return (
            <div
                style={{
                    ...appStyle,
                    ...(gameboardMeta.planning.active ? isPlanningStyle : '')
                }}
                onClick={event => {
                    event.preventDefault();
                    if (gameboardMeta.selectedMenuId === 0) {
                        selectPosition(-1);
                    } else {
                        menuSelect(0);
                    }
                    clearPieceSelection();
                    event.stopPropagation();
                }}
            >
                <Bottombar />
                <Gameboard />
                <Zoombox />
                <Sidebar selectedMenu={gameboardMeta.selectedMenuId} />
            </div>
        );
    }
}

const mapStateToProps = ({ gameboardMeta }: { gameboardMeta: any }) => ({
    gameboardMeta
});

const mapActionsToProps = {
    selectPosition,
    menuSelect,
    clearPieceSelection
};

export default connect(mapStateToProps, mapActionsToProps)(App);
