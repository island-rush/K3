import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GameInfoState, UserfeedbackState } from '../../../../types';
import { mainButtonClick } from '../../redux/actions';
import Leftcontrols from './Leftcontrols';
import { MainButton } from './MainButton';
import { Userfeedback } from './Userfeedback';

const bottombarStyle: any = {
    backgroundColor: 'Green',
    position: 'absolute',
    height: '10%',
    width: '73%',
    bottom: '0%',
    right: '0%'
};

interface Props {
    userFeedback: UserfeedbackState;
    gameInfo: GameInfoState;
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
                <Userfeedback userFeedback={userFeedback} />
                <MainButton gameInfo={gameInfo} mainButtonClick={mainButtonClick} />
            </div>
        );
    }
}

const mapStateToProps = ({ userFeedback, gameInfo }: { userFeedback: UserfeedbackState; gameInfo: GameInfoState }) => ({
    userFeedback,
    gameInfo
});

const mapActionsToProps = {
    mainButtonClick
};

export default connect(mapStateToProps, mapActionsToProps)(Bottombar);
