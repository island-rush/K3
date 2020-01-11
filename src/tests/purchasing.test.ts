import md5 from 'md5';
import { PURCHASE_PHASE_ID } from '../constants';
import { Game } from '../server/classes';

const testGameId = 999;

beforeAll(async () => {
    const testGame = await Game.add('z1z1', 'test', md5('test'), { gameId: testGameId });
    testGame.setPhase(PURCHASE_PHASE_ID);
});

afterAll(async () => {
    const testGame = new Game(testGameId);
    await testGame.delete();
});

describe('purchasing', () => {});
