import setUserfeedbackAction from "../setUserfeedbackAction";

const antiSatelliteMissiles = (invItem: any) => {
    return (dispatch: any, getState: any, emit: any) => {
        dispatch(setUserfeedbackAction("antiSatelliteMissiles"));
    };
};

export default antiSatelliteMissiles;
