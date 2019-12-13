import React, { Component } from "react";
import { connect } from "react-redux";

const appStyle: any = {
    position: "relative",
    backgroundColor: "blue",
    height: "100%",
    width: "100%"
};

const isPlanningStyle = {
    backgroundColor: "yellow"
};

interface AppProps {
    gameboardMeta: any;
    // selectPosition(): this;
    // menuSelect: any;
    // clearPieceSelection: any;
}

class App extends Component<AppProps> {
    render() {
        // const { gameboardMeta, selectPosition, menuSelect, clearPieceSelection } = this.props;
        const { gameboardMeta } = this.props;

        return (
            <div
                // style={{
                //     ...appStyle,
                //     ...(gameboardMeta.planning.active ? isPlanningStyle : "")
                // }}
                onClick={event => {
                    event.preventDefault();
                    // if (gameboardMeta.selectedMenuId === 0) {
                    //     selectPosition(-1);
                    // } else {
                    //     menuSelect(0);
                    // }
                    // clearPieceSelection();
                    event.stopPropagation();
                }}
            >
                {/* <Bottombar />
                <Gameboard />
                <Zoombox />
                <Sidebar selectedMenu={gameboardMeta.selectedMenuId} /> */}
            </div>
        );
    }
}

// App.propTypes = {
//     gameboardMeta: PropTypes.object.isRequired,
//     selectPosition: PropTypes.func.isRequired,
//     menuSelect: PropTypes.func.isRequired,
//     clearPieceSelection: PropTypes.func.isRequired
// };

const mapStateToProps = ({ gameboardMeta }: { gameboardMeta: any }) => ({
    gameboardMeta
});

const mapActionsToProps = {
    // selectPosition: selectPosition,
    // menuSelect: menuSelect,
    // clearPieceSelection: clearPieceSelection
};

export default connect(mapStateToProps, mapActionsToProps)(App);
