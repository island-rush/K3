import { Dispatch } from 'redux';
import { SERVER_CONFIRM_BATTLE_SELECTION, SOCKET_CLIENT_SENDING_ACTION, WAITING_STATUS } from '../../../../../constants';
import { ConfirmBattleSelectionRequestAction, EmitType } from '../../../../../types';
import setUserfeedbackAction from '../setUserfeedbackAction';

export const confirmBattleSelections = () => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        //check the local state before sending to the server
        const { gameboardMeta, gameInfo } = getState();
        const { gameStatus } = gameInfo;

        //TODO: could do loads more checks on current status of gameplay to prevent accidental presses? (but same checks on backend probably)
        if (gameStatus === WAITING_STATUS) {
            //already waiting
            dispatch(setUserfeedbackAction('already waiting, client prevented something...'));
            return;
        }

        const { friendlyPieces } = gameboardMeta.battle;
        //need to send to the server what selections were made, for it to handle it...

        const clientAction: ConfirmBattleSelectionRequestAction = {
            type: SERVER_CONFIRM_BATTLE_SELECTION,
            payload: {
                friendlyPieces
            }
        };

        emit(SOCKET_CLIENT_SENDING_ACTION, clientAction);
    };
};

export default confirmBattleSelections;
