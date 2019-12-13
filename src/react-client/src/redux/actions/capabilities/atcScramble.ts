import setUserfeedbackAction from "../setUserfeedbackAction";

const atcScramble = (invItem: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch(setUserfeedbackAction("atcScramble"));
    };
};

export default atcScramble;
