import setUserfeedbackAction from "../setUserfeedbackAction";

const droneSwarms = (invItem: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch(setUserfeedbackAction("droneSwarms"));
    };
};

export default droneSwarms;
