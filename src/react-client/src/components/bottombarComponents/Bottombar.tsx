import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mainButtonClick } from '../../redux/actions';
import Leftcontrols from './Leftcontrols';
import MainButton from './MainButton';
import UserFeedback from './Userfeedback';

const bottombarStyle: any = {
    backgroundColor: 'Green',
    position: 'absolute',
    height: '10%',
    width: '73%',
    bottom: '0%',
    right: '0%'
};

interface Props {
    userFeedback: string;
    gameInfo: any;
    mainButtonClick: any;
}

class Bottombar extends Component<Props> {
    render() {
        const { userFeedback, gameInfo, mainButtonClick } = this.props;

        const onClick = (event: any) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <div style={bottombarStyle} onClick={onClick}>
                <Leftcontrols />
                <UserFeedback userFeedback={userFeedback} />
                <MainButton gameInfo={gameInfo} mainButtonClick={mainButtonClick} />
            </div>
        );
    }
}

const mapStateToProps = ({ userFeedback, gameInfo }: { userFeedback: string; gameInfo: any }) => ({
    userFeedback,
    gameInfo
});

const mapActionsToProps = {
    mainButtonClick
};

export default connect(mapStateToProps, mapActionsToProps)(Bottombar);
