import { DispatchType, EmitType, InvItemType } from "../../../constants/interfaces";
import setUserfeedbackAction from "../setUserfeedbackAction";

const antiSatelliteMissiles = (invItem: InvItemType) => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction("antiSatelliteMissiles"));
    };
};

export default antiSatelliteMissiles;
