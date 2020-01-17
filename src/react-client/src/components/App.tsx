import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GameboardMetaState, PlanningState } from '../../../types';
import { clearPieceSelection, menuSelect, selectPosition } from '../redux';
import Bottombar from './bottombarComponents/Bottombar';
import Gameboard from './gameboardComponents/Gameboard';
import Sidebar from './sidebarComponents/Sidebar';
import Zoombox from './zoomboxComponents/Zoombox';

const appStyle: any = {
    position: 'relative',
    backgroundColor: '#b9b9b9',
    height: '100%',
    width: '100%'
};

const isPlanningStyle: any = {
    backgroundColor: 'yellow'
};

interface Props {
    gameboardMeta: GameboardMetaState;
    planning: PlanningState;
    selectPosition(someNum: number): any;
    menuSelect(menuId: number): any;
    clearPieceSelection(): any;
}

class App extends Component<Props> {
    render() {
        const { gameboardMeta, selectPosition, menuSelect, clearPieceSelection, planning } = this.props;

        return (
            <div
                style={{
                    ...appStyle,
                    ...(planning.active ? isPlanningStyle : '')
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

const mapStateToProps = ({ gameboardMeta, planning }: { gameboardMeta: GameboardMetaState; planning: PlanningState }) => ({
    gameboardMeta,
    planning
});

const mapActionsToProps = {
    selectPosition,
    menuSelect,
    clearPieceSelection
};

export default connect(mapStateToProps, mapActionsToProps)(App);
