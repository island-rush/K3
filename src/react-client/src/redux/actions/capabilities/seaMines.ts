import setUserfeedbackAction from "../setUserfeedbackAction";

const seaMines = (invItem: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch(setUserfeedbackAction("seaMines"));
    };
};

export default seaMines;
