import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { TYPE_MAIN, WAITING_STATUS } from '../../../../../constants';
import { ConfirmBattleSelectionRequestAction, SERVER_CONFIRM_BATTLE_SELECTION } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const confirmBattleSelections = () => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        //check the local state before sending to the server
        const { gameInfo, battle } = getState();
        const { gameStatus, gameControllers } = gameInfo;

        if (!gameControllers.includes(TYPE_MAIN)) {
            dispatch(setUserfeedbackAction('need to be main controller'));
            return;
        }

        // TODO: could do loads more checks on current status of gameplay to prevent accidental presses? (but same checks on backend probably)
        if (gameStatus === WAITING_STATUS) {
            //already waiting
            dispatch(setUserfeedbackAction('already waiting, client prevented something...'));
            return;
        }

        const { friendlyPieces } = battle;
        //need to send to the server what selections were made, for it to handle it...

        const clientAction: ConfirmBattleSelectionRequestAction = {
            type: SERVER_CONFIRM_BATTLE_SELECTION,
            payload: {
                friendlyPieces
            }
        };

        sendToServer(clientAction);
        return;
    };
};
