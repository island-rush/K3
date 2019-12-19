import { DispatchType, EmitType, InvItemType } from "../../../constants/interfaces";
import setUserfeedbackAction from "../setUserfeedbackAction";

const cyberDominance = (invItem: InvItemType) => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction("cyberDominance"));
    };
};

export default cyberDominance;
