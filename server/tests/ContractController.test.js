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

describe('ContractController', () => {
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

        contracts.push(await contractFactory.create({ userId: users[0].id }));
        contracts.push(await contractFactory.create({ userId: users[1].id }));
        contracts.push(await contractFactory.create({ userId: users[2].id }));
    });

    describe('POST /contracts', () => {
        it('returns CREATED when sending valid data AS ADMIN', async () => {
            const contractData = contractFactory.generate({ startDate: '2001-02-02', userId: users[0].id });

            const response = await request.post(`/contracts`).set('x-access-token', adminToken).send(contractData);

            expect(response.body).toHaveProperty('startDate', contractData.startDate);
            expect(response.statusCode).toEqual(HttpStatuses.CREATED);
        });

        it('returns BAD_REQUEST sending data contains not valid fields AS ADMIN', async () => {
            const contractData = await contractFactory.generate({
                startDate: 'wrongData',
                duration: 'wrongData',
                leave: 'wrongLeaveDays',
                userId: 'wrongId'
            });

            const response = await request.post(`/contracts`).set('x-access-token', adminToken).send(contractData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'startDate',
                message: 'The date must be valid'
            });
            expect(response.body.errors).toContainEqual({
                param: 'duration',
                message: 'Should be numeric'
            });
            expect(response.body.errors).toContainEqual({
                param: 'leave',
                message: 'Should be numeric'
            });
            expect(response.body.errors).toContainEqual({
                param: 'leave',
                message: 'Should be numeric'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data(blank) AS ADMIN', async () => {
            const contractData = await contractFactory.generate({
                startDate: null,
                duration: null,
                leave: null,
                userId: null
            });

            const response = await request.post(`/contracts`).set('x-access-token', adminToken).send(contractData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'startDate',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'duration',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'leave',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'userId',
                message: 'Should not be empty'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns FORBIDDEN when sending valid data AS EMPLOYEE', async () => {
            const contractData = contractFactory.generate();

            const response = await request.post(`/contracts`).set('x-access-token', userToken).send(contractData);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED when sending valid data WITHOUT TOKEN', async () => {
            const contractData = contractFactory.generate();

            const response = await request.post(`/contracts`).send(contractData);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });

    describe('PUT /contract/{id}', () => {
        it('returns OK when put a single contracts AS ADMIN', async () => {
            const contractData = await contractFactory.generate({ startDate: '2020-01-01', userId: users[0].id });

            const response = await request
                .put(`/contracts/${contracts[0].id}`)
                .set('x-access-token', adminToken)
                .send(contractData);

            expect(response.body.startDate).toEqual(contractData.startDate);
            expect(response.statusCode).toEqual(HttpStatuses.OK);
        });

        it('returns BAD_REQUEST sending invalid data(blank) AS ADMIN', async () => {
            const contractData = await contractFactory.generate({
                startDate: null,
                duration: null,
                leave: null,
                userId: null
            });

            const response = await request
                .put(`/contracts/${contracts[0].id}`)
                .set('x-access-token', adminToken)
                .send(contractData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'startDate',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'duration',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'leave',
                message: 'Should not be empty'
            });
            expect(response.body.errors).toContainEqual({
                param: 'userId',
                message: 'Should not be empty'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending data contains not valid fields AS ADMIN', async () => {
            const contractData = await contractFactory.generate({
                startDate: 'wrongData',
                duration: 'wrongData',
                leave: 'wrongLeaveDays',
                userId: 'wrongId'
            });

            const response = await request
                .put(`/contracts/${contracts[0].id}`)
                .set('x-access-token', adminToken)
                .send(contractData);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toContainEqual({
                param: 'startDate',
                message: 'The date must be valid'
            });
            expect(response.body.errors).toContainEqual({
                param: 'duration',
                message: 'Should be numeric'
            });
            expect(response.body.errors).toContainEqual({
                param: 'leave',
                message: 'Should be numeric'
            });
            expect(response.body.errors).toContainEqual({
                param: 'userId',
                message: 'Should be numeric'
            });

            expect(response.statusCode).toEqual(HttpStatuses.BAD_REQUEST);
        });

        it('returns FORBIDDEN when put a single contract AS EMPLOYEE', async () => {
            const contractData = await contractFactory.generate();

            const response = await request
                .put(`/contracts/${contracts[0].id}`)
                .set('x-access-token', userToken)
                .send(contractData);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED when put a single contract WITHOUT TOKEN', async () => {
            const contractData = await contractFactory.generate();

            const response = await request.put(`/contracts/${contracts[0].id}`).send(contractData);

            expect(response.body).toMatchObject({
                message: 'No token provided!'
            });
            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });

    describe('DELETE /contracts/{id}', () => {
        it('returns NO_CONTENT when delete not existed contract AS ADMIN', async () => {
            const response = await request.delete(`/contracts/99999999`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NO_CONTENT);
        });

        it('returns NO_CONTENT when delete a single contract AS ADMIN', async () => {
            const response = await request.delete(`/contracts/${contracts[0].id}`).set('x-access-token', adminToken);

            expect(response.statusCode).toEqual(HttpStatuses.NO_CONTENT);
        });

        it('returns FORBIDDEN when delete a single contract AS EMPLOYEE', async () => {
            const response = await request.delete(`/contracts/${contracts[0].id}`).set('x-access-token', userToken);

            expect(response.statusCode).toEqual(HttpStatuses.FORBIDDEN);
        });

        it('returns UNAUTHORIZED when delete a single contract WITHOUT TOKEN', async () => {
            const response = await request.delete(`/contracts/${contracts[0].id}`);

            expect(response.statusCode).toEqual(HttpStatuses.UNAUTHORIZED);
        });
    });
});
