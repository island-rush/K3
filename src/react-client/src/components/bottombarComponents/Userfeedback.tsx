import React, { FC } from 'react';
import { UserfeedbackState } from '../../../../types';

const userfeedbackStyle: any = {
    background: 'grey',
    height: '80%',
    width: '40%',
    position: 'relative',
    float: 'left',
    margin: '.5%'
};

interface Props {
    userFeedback: UserfeedbackState;
}

export const Userfeedback: FC<Props> = ({ userFeedback }) => {
    return <div style={userfeedbackStyle}>{userFeedback}</div>;
};
