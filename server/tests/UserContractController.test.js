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

describe('UserContractController', () => {
    afterAll(async () => {
        await logout(request);
        await sequelize.close();
    });

    beforeAll(async () => {
        await truncateDatabase();
        await runSeeders();

        const userResponse = await loginAsUser(request);
        const adminResponse = await loginAsAdmin(request);

        userToken = userResponse.body.token;
        adminToken = adminResponse.body.token;

        users.push(await userFactory.create());
        users.push(await userFactory.create());
        users.push(await userFactory.create());

        contracts.push(await contractFactory.create(users[0].id));
        contracts.push(await contractFactory.create(users[0].id));
        contracts.push(await contractFactory.create(users[1].id));
        contracts.push(await contractFactory.create(users[2].id));
    });

    describe('GET /users/{id}/contracts/', () => {
        it('returns OK fetching user contracts AS ADMIN', async (done) => {
            const userId = users[0].id;

            const response = await request.get(`/users/${userId}/contracts`).set('x-access-token', adminToken);

            expect(response.body.length).toEqual(2);
            expect(response.body[0].userId).toEqual(userId);
            expect(response.body[0].userId).toEqual(userId);
            expect(response.body[1].userId).toEqual(userId);
            expect(response.statusCode).toEqual(HttpStatuses.OK);

            done();
        });

        it('return OK trying fetch user contracts AS EMPLOYEE', async (done) => {
            const userId = users[0].id;
            const contractData = contractFactory.generate();

            const response = await request.get(`/users/${userId}/contracts`).set('x-access-token', userToken);

            expect(response.body.length).toEqual(2);
            expect(response.body[0].userId).toEqual(userId);
            expect(response.body[0].userId).toEqual(userId);
            expect(response.body[1].userId).toEqual(userId);
            expect(response.statusCode).toEqual(HttpStatuses.OK);

            done();
        });

        it('returns NOT_FOUND when fetching user contracts of non existing USER as ADMIN', async (done) => {
            const response = await request.get(`/users/99999999/contracts`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NOT_FOUND);

            done();
        });

        it('returns UNAUTHORIZED fetching user contracts WITHOUT TOKEN', async (done) => {
            const response = await request.get(`/users/${users[0].id}/contracts`);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);

            done();
        });
    });
});
