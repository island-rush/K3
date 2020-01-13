// import md5 from 'md5';
// import { BLUE_TEAM_ID, PURCHASE_PHASE_ID, TYPE_MAIN, SERVER_SHOP_PURCHASE_REQUEST, TANK_COMPANY_TYPE_ID } from '../constants';
// import { shopPurchaseRequest } from '../server/actions';
// import { Game } from '../server/classes';
// import { ShopPurchaseRequestAction } from '../types';

// const testGameId = 999;

// beforeAll(async () => {
//     const testGame = await Game.add('z1z1', 'test', md5('test'), { gameId: testGameId });
//     testGame.setPhase(PURCHASE_PHASE_ID);
// });

// afterAll(async () => {
//     const testGame = new Game(testGameId);
//     await testGame.delete();
// });

// jest.mock('../server/helpers');

// describe('purchasing', async () => {
//     const session: any = {
//         ir3: {
//             gameId: testGameId,
//             gameTeam: BLUE_TEAM_ID,
//             gameControllers: [TYPE_MAIN]
//         },
//         socketId: 'test'
//     };

//     const action: ShopPurchaseRequestAction = {
//         type: SERVER_SHOP_PURCHASE_REQUEST,
//         payload: {
//             shopItemTypeId: TANK_COMPANY_TYPE_ID
//         }
//     };

//     const results = await shopPurchaseRequest(session, action);

//     test('something', async () => {});
// });
