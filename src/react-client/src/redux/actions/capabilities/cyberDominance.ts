import setUserfeedbackAction from "../setUserfeedbackAction";

const cyberDominance = (invItem: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch(setUserfeedbackAction("cyberDominance"));
    };
};

export default cyberDominance;
