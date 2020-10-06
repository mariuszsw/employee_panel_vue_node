const HttpStatuses = require('http-status-codes');
const { sequelize } = require('../models');

const loginAsAdmin = require('./helpers/loginAsAdmin');
const logout = require('./helpers/logout');
const truncateDatabase = require('./helpers/truncateDatabase');
const runSeeders = require('./helpers/runSeeders');

const userFactory = require('./factories/user');
const contractFactory = require('./factories/contract');

const app = require('../src/app');
const loginAsUser = require('./helpers/loginAsUser');

const request = require('supertest')(app);

const users = [];
const contracts = [];

let userToken;
let adminToken;
let userResponse;
let adminResponse;

describe('UserContractController', () => {
    afterAll(async () => {
        await logout(request);
        await sequelize.close();
    });

    beforeAll(async () => {
        await truncateDatabase();
        await runSeeders();

        userResponse = await loginAsUser(request);
        adminResponse = await loginAsAdmin(request);

        userToken = userResponse.body.token;
        adminToken = adminResponse.body.token;

        loggedUserId = userResponse.body.user.id;
        loggedAdminId = adminResponse.body.user.id;

        users.push(await userFactory.create());
        users.push(await userFactory.create());
        users.push(await userFactory.create());

        contracts.push(await contractFactory.create({ userId: loggedUserId }));
        contracts.push(await contractFactory.create({ userId: loggedUserId }));
        contracts.push(await contractFactory.create({ userId: loggedAdminId }));
        contracts.push(await contractFactory.create({ userId: loggedAdminId }));
    });

    describe('GET /users/{id}/contracts/', () => {
        it('returns OK fetching user contracts AS ADMIN', async () => {
            const response = await request.get(`/users/${loggedAdminId}/contracts`).set('x-access-token', adminToken);

            expect(response.body.length).toEqual(2);
            expect(response.body[0].userId).toEqual(loggedAdminId);
            expect(response.body[1].userId).toEqual(loggedAdminId);

            expect(response.statusCode).toEqual(HttpStatuses.OK);
        });

        it('return OK trying fetch user contracts AS EMPLOYEE', async () => {
            const response = await request.get(`/users/${loggedUserId}/contracts`).set('x-access-token', userToken);

            expect(response.body.length).toEqual(2);
            expect(response.body[0].userId).toEqual(loggedUserId);
            expect(response.body[1].userId).toEqual(loggedUserId);
            expect(response.statusCode).toEqual(HttpStatuses.OK);
        });

        it('returns NOT_FOUND when fetching user contracts of non existing USER as ADMIN', async () => {
            const response = await request.get(`/users/99999999/contracts`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NOT_FOUND);
        });

        it('returns FORBIDDEN requesting other user contracts as EMPLOYEE', async () => {
            const userId = users[0].id;

            const response = await request.get(`/users/${userId}/contracts`).set('x-access-token', userToken);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED fetching user contracts WITHOUT TOKEN', async () => {
            const response = await request.get(`/users/${users[0].id}/contracts`);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });
});
