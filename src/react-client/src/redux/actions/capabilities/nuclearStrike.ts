import { DispatchType, EmitType, InvItemType } from "../../../constants/interfaces";
import setUserfeedbackAction from "../setUserfeedbackAction";

const nuclearStrike = (invItem: InvItemType) => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction("nuclearStrike"));
    };
};

export default nuclearStrike;
