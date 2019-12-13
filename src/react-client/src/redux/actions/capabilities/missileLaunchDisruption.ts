import setUserfeedbackAction from "../setUserfeedbackAction";

const missileLaunchDisruption = (invItem: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch(setUserfeedbackAction("missileLaunchDisruption"));
    };
};

export default missileLaunchDisruption;
