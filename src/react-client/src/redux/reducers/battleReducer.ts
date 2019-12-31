import { AnyAction } from 'redux';
import { BattleState } from '../../../../types';

const initialBattleState: BattleState = {
    isMinimized: false,
    active: false,
    selectedBattlePiece: -1,
    selectedBattlePieceIndex: -1, //helper to find the piece within the array
    masterRecord: null,
    friendlyPieces: [],
    enemyPieces: []
};

export function battleReducer(state = initialBattleState, action: AnyAction) {
    const { type } = action;

    let stateCopy: BattleState = JSON.parse(JSON.stringify(state));

    switch (type) {
        default:
            return state;
    }
}

export default battleReducer;
