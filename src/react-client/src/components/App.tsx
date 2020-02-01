import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { NO_MENU_INDEX, NO_POSITION } from '../../../constants';
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

        const style = {
            ...appStyle,
            ...(planning.isActive ? isPlanningStyle : '')
        };

        const onClick = (event: MouseEvent) => {
            event.preventDefault();
            if (gameboardMeta.selectedMenuId === NO_MENU_INDEX) {
                selectPosition(NO_POSITION);
            } else {
                menuSelect(NO_MENU_INDEX);
            }
            clearPieceSelection();
            event.stopPropagation();
        };

        return (
            <div style={style} onClick={onClick}>
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
