import md5 from 'md5';
import { Game } from '../../classes';

const testGameId = 999;

beforeAll(async () => {
    // Brand new game
    await Game.add('z1z1', 'test', md5('test'), { gameId: testGameId });
});

afterAll(async () => {
    // Delete the game
    const testGame = new Game({ gameId: testGameId });
    await testGame.delete();
});

describe('shop purchase', () => {
    it('should fail if bad session', () => {});
    it('should fail if bad payload', () => {});
    it('should fail if game does not exist', async () => {
        const thisGame = await new Game({ gameId: testGameId - 1 }).init();
        expect(thisGame).toBeNull();
    });
    it('should fail if game is not active', () => {});
    it('should fail if phase is not purchasing', () => {});
    it('should fail if not main controller', () => {});
    it('should fail if not enough points', () => {});
    it('should set new points', () => {});
    it('should create shop item', () => {});
    it('should send correct payload', () => {});
});
