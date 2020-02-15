import { Dispatch } from 'redux';
import { emit, FullState } from '../../';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from '../../../../../constants';
import { DroneSwarmSelectingAction, DRONE_SWARM_SELECTING, InvItemType } from '../../../../../types';
import { setUserfeedbackAction } from '../setUserfeedbackAction';

export const droneSwarms = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: () => FullState, sendToServer: typeof emit) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for drone swarm dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use drone swarm.'));
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
