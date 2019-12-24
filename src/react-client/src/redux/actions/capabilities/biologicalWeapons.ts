import { Dispatch } from 'redux';
import { COMBAT_PHASE_ID, SLICE_PLANNING_ID } from '../../../constants/gameConstants';
import { BioWeaponSelectingAction, EmitType } from '../../../interfaces/interfaces';
import { BIO_WEAPON_SELECTING } from '../actionTypes';
import setUserfeedbackAction from '../setUserfeedbackAction';
import { InvItemType } from '../../../interfaces/classTypes';

const biologicalWeapons = (invItem: InvItemType) => {
    return (dispatch: Dispatch, getState: any, emit: EmitType) => {
        const { gameInfo } = getState();
        const { gamePhase, gameSlice } = gameInfo;

        if (gamePhase !== COMBAT_PHASE_ID) {
            dispatch(setUserfeedbackAction('wrong phase for bio weapons dude.'));
            return;
        }

        if (gameSlice !== SLICE_PLANNING_ID) {
            dispatch(setUserfeedbackAction('must be in planning to use bio weapons.'));
            return;
        }

        //other checks that the player is allowed to select bio weapons (do they have it? / game effects...)

        //dispatch that the player is currently selecting which position to select
        const bioWeaponSelectingAction: BioWeaponSelectingAction = {
            type: BIO_WEAPON_SELECTING,
            payload: {
                invItem
            }
        };

        dispatch(bioWeaponSelectingAction);
    };
};

export default biologicalWeapons;
