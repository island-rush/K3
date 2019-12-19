import { DispatchType, EmitType, InvItemType } from "../../../constants/interfaces";
import setUserfeedbackAction from "../setUserfeedbackAction";

const atcScramble = (invItem: InvItemType) => {
    return (dispatch: DispatchType, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction("atcScramble"));
    };
};

export default atcScramble;
