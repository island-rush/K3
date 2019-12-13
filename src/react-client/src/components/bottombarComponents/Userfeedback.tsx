import React, { FC } from "react";

const userfeedbackStyle: any = {
    background: "grey",
    height: "80%",
    width: "40%",
    position: "relative",
    float: "left",
    margin: ".5%"
};

interface Props {
    userFeedback: string;
}

const Userfeedback: FC<Props> = ({ userFeedback }) => {
    return <div style={userfeedbackStyle}>{userFeedback}</div>;
};

export default Userfeedback;
