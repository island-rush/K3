import { AnyAction } from 'redux';
import { ContainerState } from '../../../../types';

const initialContainerState: ContainerState = {
    active: false,
    isSelectingHex: false,
    innerPieceToDrop: null,
    containerPiece: null,
    outerPieces: []
};

export function containerReducer(state = initialContainerState, action: AnyAction) {
    const { type } = action;

    let stateCopy: ContainerState = JSON.parse(JSON.stringify(state));

    switch (type) {
        default:
            return state;
    }
}

export default containerReducer;
