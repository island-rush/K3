import { Dispatch } from "redux";
import { EmitType, InvItemType } from "../../../constants/interfaces";
import setUserfeedbackAction from "../setUserfeedbackAction";

const missileLaunchDisruption = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction("missileLaunchDisruption"));
    };
};

export default missileLaunchDisruption;
