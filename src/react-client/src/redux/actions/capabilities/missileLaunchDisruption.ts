import { DispatchType, EmitType, InvItemType } from "../../../constants/interfaces";
import setUserfeedbackAction from "../setUserfeedbackAction";

const missileLaunchDisruption = (invItem: InvItemType) => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction("missileLaunchDisruption"));
    };
};

export default missileLaunchDisruption;
