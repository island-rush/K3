import { Dispatch } from "redux";
import { EmitType, InvItemType } from "../../../constants/interfaces";
import setUserfeedbackAction from "../setUserfeedbackAction";

const atcScramble = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        dispatch(setUserfeedbackAction("atcScramble"));
    };
};

export default atcScramble;
