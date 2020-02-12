import React, { FC, MouseEvent } from 'react';
import { UserfeedbackState } from '../../../../types';

const userfeedbackStyle: any = {
    background: 'grey',
    height: '80%',
    width: '60%',
    position: 'relative',
    float: 'left',
    margin: '.5%'
};

interface Props {
    userFeedback: UserfeedbackState;
}

export const Userfeedback: FC<Props> = ({ userFeedback }) => {
    const standardOnClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div style={userfeedbackStyle} onClick={standardOnClick}>
            {userFeedback}
        </div>
    );
};
