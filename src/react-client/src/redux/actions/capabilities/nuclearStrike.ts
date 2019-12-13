import setUserfeedbackAction from "../setUserfeedbackAction";

const nuclearStrike = (invItem: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch(setUserfeedbackAction("nuclearStrike"));
    };
};

export default nuclearStrike;
