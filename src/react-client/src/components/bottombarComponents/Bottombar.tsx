import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { GameInfoState, UserfeedbackState } from '../../../../types';
import { cancelPlan, confirmPlan, mainButtonClick, startPlan, undoMove } from '../../redux';
import { Leftcontrols } from './Leftcontrols';
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
    startPlan: () => void;
    cancelPlan: () => void;
    confirmPlan: () => void;
    undoMove: () => void;
}

class Bottombar extends Component<Props> {
    render() {
        const { userFeedback, gameInfo, mainButtonClick, startPlan, cancelPlan, confirmPlan, undoMove } = this.props;

        const onClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <div style={bottombarStyle} onClick={onClick}>
                <Leftcontrols startPlan={startPlan} cancelPlan={cancelPlan} confirmPlan={confirmPlan} undoMove={undoMove} />
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
    mainButtonClick,
    startPlan,
    cancelPlan,
    confirmPlan,
    undoMove
};

export default connect(mapStateToProps, mapActionsToProps)(Bottombar);
