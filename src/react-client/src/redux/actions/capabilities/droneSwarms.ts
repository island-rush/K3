import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_SPECIAL, WAITING_STATUS } from '../../../../../constants';
import { DroneSwarmSelectingAction, DRONE_SWARM_SELECTING, InvItemType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const droneSwarms = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice, gameStatus, gameControllers } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for drone swarm dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use drone swarm.'));
            return;
        }

        if (gameStatus === WAITING_STATUS) {
            dispatch(setUserfeedbackAction('already clicked to continue'));
            return;
        }

        if (!gameControllers.includes(TYPE_SPECIAL)) {
            dispatch(setUserfeedbackAction('must be special controller to use'));
            return;
        }

        //dispatch that the player is currently selecting which position to select
        const droneSwarmSelectingAction: DroneSwarmSelectingAction = {
            type: DRONE_SWARM_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(droneSwarmSelectingAction);
        return;
    };
};
