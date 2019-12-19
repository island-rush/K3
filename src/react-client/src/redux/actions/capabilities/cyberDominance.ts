import { Dispatch } from "redux";
import { EmitType, InvItemType } from "../../../constants/interfaces";
import setUserfeedbackAction from "../setUserfeedbackAction";

const cyberDominance = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction("cyberDominance"));
    };
};

export default cyberDominance;
